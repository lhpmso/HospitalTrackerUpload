import Grid from '@material-ui/core/Grid';
import PropTypes from "prop-types";
import React, {useState} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import * as AdminActions from '../actions/AdminActions'
import {url} from "../actions/URL";
import {authProvider} from "../AuthProvider";
import {DataGrid, GridAddIcon} from '@material-ui/data-grid';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {TextField} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import {createTransferFacility} from "../actions/AdminActions";
import Button from "@material-ui/core/Button";

const columns = [
    {
        field: "entryName",
        headerName: "Facility Name",
        flex: 1,
    },
    {
        field: "entryCode",
        headerName: "NPI",
        flex: 1,
    },
    {
        field: "addressLine1",
        headerName: "Address",
        flex: 1,
    },
    {
        field: "city",
        headerName: "City",
        flex: 1,
    },
    {
        field: "state",
        headerName: "State",
        flex: 1,
    },
]

const TransferFacilityComponent = (props) => {
    const [currentPage, setPage] = useState(1)

    const [limit, setLimit] = useState(10)
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [rowCount, setRowCount] = React.useState(0)
    const [query, setQuery] = React.useState('')
    React.useEffect(() => {
        let active = true;

        (async () => {
            setLoading(true);
            
            
            const payload = await loadServerRows(currentPage < 1 ? 1 : currentPage, limit);
            console.log(payload)
            const {data, page, total} = payload.payload

            if (!active) {
                return;
            }
            setRowCount(total)
            setRows(data);
            setPage(page);
            setLoading(false);
        })();
        return () => {
            active = false;
        };
    }, [currentPage, limit, query]);

    //props.admin.getTransferFacilities(page, limit)

    async function loadServerRows(page, limit) {
        let token = await authProvider.getAccessToken();
        if (query !== '') {
            let response = await fetch(url(`Facility/search?` + new URLSearchParams({
                limit: limit,
                page: page,
                query: query
            })), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            return await response.json();
        } else {


            let response = await fetch(url(`Facility/get?` + new URLSearchParams({limit: limit, page: page})), {

                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            return await response.json();
        }


    }

    return (
        <>
            <Grid container style={{marginTop: 20}}>

                <Grid item xs={12}>

                    <TableContainer component={Paper} style={{width: "100%"}}>
                        <div style={{padding: 10, paddingTop: 30}}>
                            <TextField label={"Search for Facility"}
                                       onChange={(e) => setQuery(e.target.value)}
                                       InputProps={
                                           query.length === 10 && !isNaN(query) && rowCount === 0 ?
                                               {
                                                   startAdornment: (
                                                       <InputAdornment position={"start"}>
                                                           <IconButton>
                                                               <SearchIcon/>
                                                           </IconButton>
                                                       </InputAdornment>
                                                   ),
                                                   endAdornment: (

                                                       <InputAdornment position={"end"}>
                                                           <IconButton color={"primary"}
                                                                       onClick={() => props.admin.createTransferFacility(query, (d) => {
                                                                           if (d.errorMsg) {
                                                                               alert(d.errorMsg)
                                                                           } else {
                                                                               let q = query;
                                                                               setQuery('');
                                                                               setQuery(q);
                                                                           }
                                                                       })
                                                                       }>

                                                               <GridAddIcon/>
                                                           </IconButton>
                                                       </InputAdornment>
                                                   )
                                               } : {
                                                   startAdornment: (
                                                       <InputAdornment position={"start"}>

                                                           <SearchIcon/>

                                                       </InputAdornment>
                                                   )
                                               }
                                       }
                                       fullWidth/>
                        </div>
                        <DataGrid rows={rows}
                                  columns={columns}
                                  getRowId={(r) => r.dictFacilityId}
                                  autoHeight
                                  pagination
                                  page={currentPage}
                                  pageSize={limit}
                                  paginationMode={"server"}
                                  rowCount={rowCount}
                                  onPageChange={(params) => {
                                      setPage(params.page);
                                  }}
                                  loading={loading}
                        />
                        <div style={{padding: 20, paddingTop: 30}}>
                            <p><em>Start by searching by an NPI. If the facility is not found then the add button will
                                appear on the far right. Click the add button to add the facility. Use the below link to
                                find facility NPIs.</em></p>
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                target={"_blank"} href={"https://npiregistry.cms.hhs.gov/registry/"}>
                                NPI Registry
                            </Button>


                        </div>
                    </TableContainer>
                </Grid>
            </Grid>
        </>)

}

TransferFacilityComponent.propTypes = {
    actions: PropTypes.object,
    admin: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        facilities: state.admin.transferFacilities
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
        admin: bindActionCreators(AdminActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferFacilityComponent)