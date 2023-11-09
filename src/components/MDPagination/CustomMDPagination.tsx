import * as React from "react";
import MDPagination from ".";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { IPaginationResponse } from "types";

interface Props {
  pagination: IPaginationResponse;
  handleChangePage: any;
}

export function CustomMDPagination({ pagination, handleChangePage }: Props): JSX.Element {
  let start = 1;
  let array = Array.from({ length: 5 }, (v, i) => i + start);
  if (pagination.total_pages > 5) {
    if (pagination.current < 3) start = 1;
    else if (pagination.current > pagination.total_pages - 3) start = pagination.total_pages - 5;
    else {
      start = pagination.current - 2;
    }
    array = Array.from({ length: 5 }, (v, i) => i + start);
  }

  return (
    <Grid item xs={12} md={5}>
      {pagination.total_pages > 1 && (
        <MDPagination variant="gradient" color="info">
          {pagination.prev && (
            <MDPagination item onClick={() => handleChangePage(pagination.prev)}>
              <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
            </MDPagination>
          )}
          {array.map((ele, _: any) => (
            <MDPagination
              item
              key={ele}
              onClick={() => handleChangePage(Number(ele))}
              active={pagination.current === ele}
            >
              {ele}
            </MDPagination>
          ))}
          {pagination.next && (
            <MDPagination item onClick={() => handleChangePage(pagination.next)}>
              <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
            </MDPagination>
          )}
        </MDPagination>
      )}
    </Grid>
  );
}
