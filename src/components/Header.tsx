import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import logo from '../assets/logo.png'

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: 'all' | 'open' | 'in-progress' | 'resolved';
    setStatusFilter: (filter: 'all' | 'open' | 'in-progress' | 'resolved') => void;
  }

function Header({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: HeaderProps) {

    const { user, signOut } = useAuthenticator();
    const [isOpen, setIsOpen] = useState(false);


    const toggleDropdown = () => setIsOpen((prev) => !prev);

    return (
        <>
            <div className="h-[60px] grid grid-cols-5 gap-x-4 items-center rounded-none px-[4vw] bg-white">
                <div className='w-[10vw] h-[45px]'>
                    <img src={logo} className='w-full h-full object-cover'/>
                </div>
                <p className="text-2xl font-bold text-center col-span-3 ">📋Gestion de Tickets</p>
                <div className="relative">
                    <p className="text-right cursor-pointer hover:text-blue-500" onClick={toggleDropdown}>
                        {user.signInDetails?.loginId && user.signInDetails?.loginId}
                    </p>

                    {isOpen && (
                    <div className="absolute right-0 top-full bg-white drop-shadow-lg rounded-lg p-2 min-w-[150px] opacity-100 visible transform translate-y-1 transition ease-in-out hover:bg-gray-100">
                        <button className="menu-item w-full text-center cursor-pointer text-center" onClick={signOut}>
                            Cerrar sesión
                        </button>
                    </div>
                    )}
                </div>
            </div>
            <div className="h-[70px] shadow-md grid grid-cols-8 gap-x-4 items-center rounded-none px-[4vw] bg-white">
                <input 
                    className='rounded-lg px-[1vw] py-1 border border-zinc-300 col-span-2'
                    type="text" 
                    placeholder="Buscar tickets..." 
                    id="searchInput"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'in-progress' | 'resolved')}
                    name="status" 
                    className='rounded-lg px-[1vw] py-1 bg-white border border-zinc-300'>
                    <option value="all">Todos</option>
                    <option value="open">Pendientes</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="resolved">Resueltos</option>
                </select>
            </div>
        </>
    );
}

export default Header;
