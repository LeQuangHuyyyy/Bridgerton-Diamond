export const Paging: React.FC<{ currentPage: number, totalPages: number, paginate: any }> = (props) => {
    const pageNumbers = [];
    if (props.currentPage === 1) {
        pageNumbers.push(props.currentPage);
        if (props.totalPages >= props.currentPage + 1) {
            pageNumbers.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            pageNumbers.push(props.currentPage + 2);
        }
    } else if (props.currentPage > 1) {
        if (props.currentPage >= 3) {
            pageNumbers.push(props.currentPage - 2);
            pageNumbers.push(props.currentPage - 1);
        }

        pageNumbers.push(props.currentPage);
        if (props.totalPages >= props.currentPage + 1) {
            pageNumbers.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            pageNumbers.push(props.currentPage + 2);
        }
    }

    return (
        <nav aria-label="...">
            <ul className='paginate'>
                <li className='page-item' onClick={() => props.paginate(1)}>
                    <button className='page-link'>
                        First Page
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li
                        key={number} onClick={() => props.paginate(number)}
                        className={'page-item' + (props.currentPage === number ? ' active' : '')}>
                        <button style={{
                            border: '1px solid black',
                            padding: '10px 15px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center ',
                            margin: '0 1px'
                        }} className='page-link'>
                            {number}
                        </button>
                    </li>
                ))}
                <li className='page-item' onClick={() => props.paginate(props.totalPages)}>
                    <button className='page-link'>
                        Last Page
                    </button>
                </li>
            </ul>

        </nav>
    );
}