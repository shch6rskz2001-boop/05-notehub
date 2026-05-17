import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface Props {
  pageCount: number;
  forcePage: number;
  onPageChange: (selected: number) => void;
}

export default function Pagination({
  pageCount,
  forcePage,
  onPageChange,
}: Props) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) =>
        onPageChange(selected + 1)
      }
      forcePage={forcePage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}