import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Shops from './pages/Shops';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import Details from './pages/Details';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/shops' element={<Shops/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/shipping' element={<Shipping/>} />
      <Route path='/product/details/:slug' element={<Details/>} /> 
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;
