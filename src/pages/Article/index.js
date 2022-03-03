import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

import './style.css';

export default function Article(){
    const articles = useSelector(state => state.navData);
    const navigate = useNavigate([]);

    useEffect(() => {
        if( articles.length === 0){
            navigate('/');
            alert('Page not Found');
            return;
        }
    }, [navigate])

    return(
        <div className='container'>
            <Link  to="/" className='navLink' id="goBackLink"> Go to results page</Link>
            <div>
                {articles.map(item =>{
                    const newDate = moment(item.pub_date).format('DD.MM.YYYY');

                    return(
                        <div key={item._id} className="articleContent">
                            <h1>{item.headline.main}</h1>
                            <span>{newDate}</span>
                            <p>{item.abstract}</p>
                            <a target="_blank" rel="noreferrer" href={item.web_url} className='navLink'>Read the full article</a>
                        </div>
                    )
                })}
            </div> 
        </div>
    )
}