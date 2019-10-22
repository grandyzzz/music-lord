import React from 'react'

const Dots = props => (
    <svg { ...props } width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="1" cy="1" r="1" fill="#333333"/>
        <circle cx="6" cy="1" r="1" fill="#333333"/>
        <circle cx="11" cy="1" r="1" fill="#333333"/>
    </svg>
);

export default Dots;