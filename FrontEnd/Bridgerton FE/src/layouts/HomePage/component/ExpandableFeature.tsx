import React, { useState } from 'react';
import './ExpandableFeature.css';

interface FeatureProps {
    title: string;
    content: string;
}

const ExpandableFeature: React.FC<FeatureProps> = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="feature-item">
            <div className="feature-header" onClick={toggleOpen}>
                <h3>{title}</h3>
                <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && <p className="feature-content">{content}</p>}
        </div>
    );
};

export default ExpandableFeature;
