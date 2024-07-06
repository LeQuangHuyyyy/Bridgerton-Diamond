import React from "react";
import FooterMap from "./component/FooterMapProps";
import ContactForm from "./component/ContactForm";

const ContactUs: React.FC = () => {
    return (
        <div className="contact-us-container container">
            <FooterMap/>
            <ContactForm/>
        </div>
    );
};

export default ContactUs;
