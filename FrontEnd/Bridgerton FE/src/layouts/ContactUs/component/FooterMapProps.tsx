import React from 'react';

const ContactInfo: React.FC = () => {
    return (
        <div className="col-lg-5 mb-5">
            <div className="bg-light p-30 mb-30">
                <iframe
                    width="1300px"
                    height="500px"
                    id="gmap_canvas"
                    src="https://maps.google.com/maps?width=959&amp;height=431&amp;hl=en&amp;q=146/33 Nguyễn Thị Kiểu Phường Hiệp Thành, quận 12&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                ></iframe>
            </div>
        </div>
    );
};
export default ContactInfo;
