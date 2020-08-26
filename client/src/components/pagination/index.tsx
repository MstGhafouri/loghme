import React from "react";
import ReactPaginate from "react-paginate";

export interface PaginationProps {
  perPage: number;
  pageCount: number;
  onPageClick(page: number): void;
}

class Pagination extends React.Component<PaginationProps> {
  state = {
    pageNumber: 0
  };

  handlePageClick = ({ selected }: any) => {
    this.props.onPageClick(selected + 1);
    this.setState({ selected });
  };

  render() {
    return (
      <div className="pagination">
        <ReactPaginate
          previousLabel={"قبلی"}
          nextLabel={"بعدی"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.props.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={this.handlePageClick}
          forcePage={this.state.pageNumber}
          containerClassName={"pagination__list"}
          activeClassName={"active"}
        />
      </div>
    );
  }
}

export default Pagination;
