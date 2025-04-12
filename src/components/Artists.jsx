import React, { useEffect, useState } from "react";
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { baseUrl } from "../config/config";

const Artists = ({ artists }) => {
    return (
        <div className="artists container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="row">
                        {
                            artists ? (
                                artists.map(artist => (
                                    <div className="col-lg-3 col-sm-6">
                                        <Link to={`/artist/${artist.id}`}>
                                            <div className="item">
                                                <img src={baseUrl + artist.avatarUrl} alt="" />
                                                <h4>{artist.name}<br /><span>{artist.jobTitle}</span></h4>
                                                <ul>
                                                    <li><i><FontAwesomeIcon icon={faUser} /></i> {artist.followers.length} </li>
                                                    <li><small><i><FontAwesomeIcon icon={faClock} /></i> {new Date(artist.createdDate).toLocaleString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })} </small></li>
                                                </ul>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (<></>)
                        }
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Artists;