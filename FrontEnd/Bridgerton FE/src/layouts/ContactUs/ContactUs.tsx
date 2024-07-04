import React from "react";
import FooterMap from "./component/FooterMapProps";
import ContactForm from "./component/ContactForm";

const ContactUs: React.FC = () => {
    const latitude = 10.762622;
    const longitude = 106.660172;

    return (
        <div className="contact-us-container container">
            <FooterMap/>
            <ContactForm/>
        </div>
    );
};

export default ContactUs;
