import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
//import Header from "./components/Header.tsx";


const client = generateClient<Schema>();

function App() {
  const { user } = useAuthenticator();
  const [tickets, setTickets] = useState<Array<Schema["Ticket"]["type"]>>([]);

  const [modal, setModal] = useState(false)

  interface IFormData {
    title: string;
    description: string;
    status: 'open' | 'resolved' | 'in-progress';
    doneBy: string | null;
    userEmail: string | null;
  }

  const [formData, setFormData] = useState<IFormData>({
    title:'',
    description:'',
    status: 'open',
    doneBy: null,
    userEmail: user?.signInDetails?.loginId || '',
  })

  function formatStatus(status:string){
    switch (status){
      case 'open':
        return '🟡 Pendiente';
      case 'resolved':
        return '🟢 Resuelto'
      case 'in-progress':
          return '🟠 En progreso';
    }
  }

  function formatTimestamp(timestamp:string) {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, 
    }).format(date);
  }
  
  
function statusColor(status:string) {
    switch (status){
      case 'open':
        return 'bg-yellow-100';
      case 'resolved':
        return 'bg-green-100'
      case ' in-progress':
          return 'bg-blue-100';
  }
}

  const fetchData = async () => {
    try {
      await client.models.Ticket.observeQuery().subscribe({
        next: (data) => setTickets([...data.items])
      });
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> ) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };
  

  const createTicket = () => {
    
    if(formData.title.trim().length === 0 || formData.description.trim().length === 0){
      return console.log('Por favor rellena todos los campos')
    }

    client.models.Ticket.create(formData);
    formData.title = ''
    formData.description = ''
    setModal(false);
  }

  return (
    <main>

    

      <button onClick={() => setModal(true)} className="w-[50px] h-[50px] bg-blue-400 flex text-white rounded-full items-center justify-center text-3xl font-bold p-4 cursor-pointer fixed bottom-4 right-4">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z" fill="#ffffff"></path> </g></svg>
      </button>
      <div className="grid grid-cols-4 gap-4 px-[3vw] my-[3vw]">
        {tickets.map((todo) => (
          <div className="bg-white drop-shadow-lg rounded-lg p-[1vw] flex flex-col" key={todo.id}>
            <p className="font-bold text-lg">{todo.title}</p>
            <p>{todo.description}</p>
            <p className="">📅 {formatTimestamp(todo.createdAt)}</p>
            <p>👤 {todo.userEmail}</p>
            <p className={`${statusColor(todo.status ?? 'open')} rounded-lg`}>
              {formatStatus(todo.status ?? 'open')}
            </p>
          </div>
          
        ))}
      </div>
        { modal &&
          <div className="flex flex-col justify-around space-y-4 py-4 px-8 max-w-md mx-auto bg-white rounded-2xl absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl w-[50vw] h-[50vh]">
            <h2 className="font-semibold text-xl">Crear nuevo ticket</h2>
            <div className="flex flex-col space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Titulo"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button
              onClick={createTicket}
              className="w-full h-10 bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition rounded-lg"
            >
              Agregar
            </button>
            <button
              onClick={() => setModal(false)}
              className="w-full h-10 bg-zinc-400 text-white flex items-center justify-center hover:bg-zinc-300 transition rounded-lg"
            >
              Cancelar
            </button>
          </div>
        }
    </main>
  );
}

export default App;
