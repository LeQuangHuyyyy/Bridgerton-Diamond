import React from 'react';
import './ExperienceSection.css';
import ExpandableFeature from "../../Utils/ExpandableFeature";

const ExperienceSection: React.FC = () => {
    return (
        <div className="experience-section">
            <div className="text-content">
                <h3 style={{paddingLeft: 0}}>We're committed to making your entire experience a pleasant one, from shopping to shipping.</h3>
                <p>
                    Every item we send comes in our signature Bridgerton packaging. Engagement rings arrive in a deluxe ring box within an elegant presentation box ready for your proposal. The presentation box also secures your appraisal certificate and GIA diamond grading report. Loose diamonds are presented in a velvet lined diamond case that securely holds the stone.
                </p>
                <div className="features">
                    <ExpandableFeature
                        title="Discreet Packaging"
                        content="Our shipping box won't give away what's inside."
                    />
                    <ExpandableFeature
                        title="Secure and Convenient Pickup Option"
                        content="You can choose to pick up your order at a secure location."
                    />
                    <ExpandableFeature
                        title="Free Shipping"
                        content="We offer fast and free shipping on every order."
                    />
                </div>
            </div>
            <div className="image-content">
                <img src="https://ecommo--ion.bluenile.com/static-diamonds-bn/Ringbox.d298a.jpg" alt="Engagement Ring in a Box" />
            </div>
        </div>
    );
};

export default ExperienceSection;
