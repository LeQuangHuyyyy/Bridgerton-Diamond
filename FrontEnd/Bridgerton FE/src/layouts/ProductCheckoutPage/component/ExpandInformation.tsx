import React, {ReactNode, useCallback, useState} from 'react';
import './ExpandInformation.css';

interface FeatureProps {
    title: string;
    content: ReactNode;
}

const ExpandInformation: React.FC<FeatureProps> = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen(prevState => !prevState);
    }, []);
    return (
        <div style={{width: 500}} className="feature-item">
            <div className="feature-header" onClick={toggleOpen}>
                <h3>{title}</h3>
                <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && <div className="feature-content">{content}</div>}
        </div>
    );
};

export default ExpandInformation;
