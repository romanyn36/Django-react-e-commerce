import React from 'react'
import { Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function SimplePaginator({ pages, page, keyword = '', isAdmin = false }) {
    console.log("Current Page:", keyword)

    return (
        <div>
            <Pagination>
                {[...Array(pages).keys()].map(x => (
                    <Pagination.Item
                        key={x + 1}
                        active={x + 1 === page}
                        as={Link}
                        to={ isAdmin ? `/admin/products/?keyword=${keyword}&page=${x + 1}` :
                            `/?keyword=${keyword}&page=${x + 1}`}
                    >
                        {x + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    )
}


function AdvancedPaginator({ pages, page, keyword = '', isAdmin = false }) {
    console.log("Current Page:", page)

    const getPaginationItems = () => {
        let items = []

        // First and Previous buttons
        items.push(
            <Pagination.First
                key="first"
                disabled={page === 1}
                as={Link}
                to={`/?keyword=${keyword}&page=1`}
            />
        )
        items.push(
            <Pagination.Prev
                key="prev"
                disabled={page === 1}
                as={Link}
                to={`/?keyword=${keyword}&page=${page - 1}`}
            />
        )

        // Page number buttons with ellipsis
        if (page > 2) {
            items.push(
                <Pagination.Item key={1} as={Link} to={`/?keyword=${keyword}&page=1`}>
                    {1}
                </Pagination.Item>
            )
            if (page > 3) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />)
            }
        }

        for (let x = page - 1; x <= page + 1; x++) {
            if (x > 0 && x <= pages) {
                items.push(
                    <Pagination.Item
                        key={x}
                        active={x === page}
                        as={Link}
                        to={`/?keyword=${keyword}&page=${x}`}
                    >
                        {x}
                    </Pagination.Item>
                )
            }
        }

        if (page < pages - 1) {
            if (page < pages - 2) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />)
            }
            items.push(
                <Pagination.Item
                    key={pages}
                    as={Link}
                    to={`/?keyword=${keyword}&page=${pages}`}
                >
                    {pages}
                </Pagination.Item>
            )
        }

        // Next and Last buttons
        items.push(
            <Pagination.Next
                key="next"
                disabled={page === pages}
                as={Link}
                to={`/?keyword=${keyword}&page=${page + 1}`}
            />
        )
        items.push(
            <Pagination.Last
                key="last"
                disabled={page === pages}
                as={Link}
                to={`/?keyword=${keyword}&page=${pages}`}
            />
        )

        return items
    }

    return (
        <div>
            <Pagination>
                {getPaginationItems()}
            </Pagination>
        </div>
    )
}
const Paginator = ({ pages, page, keyword = '', isAdmin = false }) => {
    return (
        <div>
            {/* <AdvancedPaginator pages={pages} page={page} keyword={keyword} /> */}
            <SimplePaginator pages={pages} page={page} keyword={keyword} isAdmin={isAdmin} />
        </div>
    )
}



export default Paginator
