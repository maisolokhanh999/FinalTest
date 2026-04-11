import { NavLink } from 'react-router';
import {  Flex, Input } from 'antd';
const Header = () => {
    return (
        <header className="bg-amber-200 py-4">
            <div className="container mx-auto flex items-center justify-between py-4 ">
                <nav>
                    <ul className="flex space-x-4 gap-5">
                        <li><NavLink to="/" className="text-gray-600 hover:text-gray-800">Home</NavLink></li>
                        <li><NavLink to="/Product" className="text-gray-600 hover:text-gray-800">Product</NavLink></li>
                        <li><NavLink to="/ServicePackage" className="text-gray-600 hover:text-gray-800">ServicePackage</NavLink></li>
                    </ul>
                </nav>
                <Flex vertical gap={12}>
                    <Input placeholder="Outlined" />
                </Flex>
            </div>
        </header>
    );
}

export default Header;
