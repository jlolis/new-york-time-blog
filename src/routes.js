import React from "react";
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Article from './pages/Article';

export default function routes(){
    return(
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/article/:id/*' element={<Article />} />
            </Routes>
    )
}