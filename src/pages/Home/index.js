import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import './style.css';
import searchIcon from '../../assets/searchIcon.png';

import api from '../../services/api';

export default function Home(){
    const [ totalPosts, setTotalPosts ] = useState([]);
    const [ loading, setLoading] = useState(false);
    const [ currentPage, setCurrentPage] = useState(1);
    const [ postsPerPage ] = useState(5);
    const [ articles, setArticles ] = useState([]);
    const [ status, setStatus ] = useState(false);
    const [ terms, setTerms ] = useState(getSearch);
    const dispatch = useDispatch();

    async function searchApi(){
        setCurrentPage(1);
        setLoading(true);
        const response = await api.get('?q=' + terms + '&fq=document_type:"article"&api-key=vEloLbDvupw4HO8S5NY8GMB1xLEM8AgO');
        const responseString = JSON.stringify(response.data.response.docs).replaceAll("\\r\\n|\\n", "");
        const responseJson = JSON.parse(responseString);

        if(response.data.response.docs.length === 0){
            setStatus(false);
        }else if(response.data.status === "OK"){
            setArticles(responseJson);
            setStatus(true);
            saveSearch(terms);
            setTotalPosts(responseJson.length);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(sessionStorage.getItem('term')){
            searchApi();
        }
    }, []);

    function handleAdd(article){
        dispatch({
          type: 'NAV_ARTICLE',
          article
        });
    }

    function handleKeyDown(e){
        if(e.key === "Enter"){
            searchApi();
        }
    }

    function saveSearch(t){
        sessionStorage.setItem('term',  t);
    }

    function getSearch(){
        if(sessionStorage.getItem('term')){
            const termSearch = sessionStorage.getItem('term');
            return termSearch
        }else{
            return '';
        }
    }

    //Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost =  indexOfLastPost - postsPerPage;
    const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);

    //Pagination
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage) ; i++){
        pageNumbers.push(i);
    }

    //change page
    const paginate = pageNumbers => setCurrentPage(pageNumbers);

    function nextPage(){
        if(currentPage +1 <= pageNumbers.length){
            paginate(currentPage +1);
        }
        
    }

    function backPage(){
        if(currentPage -1 > 0){
            paginate(currentPage -1);
        }
    }


    return(
        <div className="container">
            <div className="search-form">
                <h3>Type search query term in here:</h3>
                <div className="search-input">
                    <input type="text" onChange={(e) => setTerms(e.target.value)} onKeyPress={handleKeyDown} placeholder={terms} />
                    <button className="search-button" value="o" type="submit" onClick={()=>{searchApi()}}><img src={searchIcon}/></button>
                </div>
            </div>

            <div className="results">
                <strong>Results:</strong>
                { !loading ? currentPosts.map(article => (
                    <div key={article._id} className="article">
                            <Link to={`/article/${article._id}`} onClick={() => handleAdd(article)}><span>{article.headline.main}</span></Link> 
                    </div>
                ))
                : 
                    <div className="error-article-title">
                        <h2>Loading...</h2>
                    </div>
                }

                <div className="nav-section">
                    { currentPage > 1 ? <a onClick={() => backPage()} className="back-button navLink"> Prev page</a> : <a></a>}
                    { currentPage != pageNumbers.length && status ? <a onClick={() => nextPage()} className="next-button navLink">Next page </a> : <a></a>}
                </div>
            </div>
        </div>
    )
}