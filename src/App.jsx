import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Shops from './pages/Shops';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import Details from './pages/Details';
import Login from './pages/Login';
import Register from './pages/Register';
import { get_category } from './store/reducers/homeReducer';
import { useDispatch} from 'react-redux';
import CategoryShop from './pages/CategoryShop';
import SearchProducts from './pages/SearchProducts';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_category()) 
},[])

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/shops' element={<Shops/>} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/shipping' element={<Shipping/>} />
      <Route path='/product/details/:slug' element={<Details/>} /> 
      <Route path='/products?' element={<CategoryShop/>} />
      <Route path='/products/search?' element={<SearchProducts/>} />
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;
