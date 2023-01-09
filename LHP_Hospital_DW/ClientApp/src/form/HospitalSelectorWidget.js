import Grid from "@material-ui/core/Grid";
import React from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as FormActions from "../actions/FormActions";
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as types from "../actions/types";
import MaterialTable from "material-table";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CloseIcon from "@material-ui/icons/Close";

// const Json = ({data, onChange}) => <AceEditor onChange={onChange} width="100%" theme="github" mode="json"
//                                               value={JSON.stringify(data, null, 4)}/>;


const initialState = {
    form: {
        facilities: {}
    },
};

export const HospitalSelectorReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_FACILITY_BY_NPI:
            let form = Object.assign({}, state.form.facilities);
            if (action.payload) {
                let npi = action.payload.entryCode ? action.payload.entryCode : null;
                if (npi != null) {
                    form.facilities = form.facilities ? form.facilities : {};
                    form.facilities[npi] = action.payload;
                    return {...state, form: form}
                }
            }
            return {...state};
        case types.SEARCH_FACILITY_BY_NAME:
            return {...state, searchResults: action.payload};
        case types.CLEAR_FACILITY_SEARCH_RESULTS:
            return {...state, searchResults: []};
        default:
            return state
    }

};

class HospitalSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showParOnly: true
        };
        this.handleFacilitySelect = this.handleFacilitySelect.bind(this);
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selector.searchResults) {
            if (prevState.showParOnly === true) {
                return {searchResults: nextProps.selector.searchResults.filter(r => r.planParticipant === true)}
            } else {
                return {searchResults: nextProps.selector.searchResults}
            }
        }
        return null;
    };

    handleFacilitySelect(event, rowdata) {
        this.props.onChange(rowdata.entryCode);
        this.props.actions.clearSearchResults();
        this.props.close()
    }


    render() {
        const {open, actions} = this.props;

        return (
            <>
                <Dialog open={open} maxWidth={"xl"} fullWidth>
                    <DialogTitle>
                        <Grid justify="space-between"
                              alignItems="center"
                              container>
                            <Grid item>
                                <span>Select Hospital</span>
                            </Grid>
                            <Grid item>
                                <IconButton>
                                    <CloseIcon onClick={(e) => {
                                        e.preventDefault();
                                        this.props.close();
                                        this.props.actions.clearSearchResults();

                                    }
                                    }/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>

                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        onChange={(e) => actions.searchForFacility(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment>
                                                    <IconButton>
                                                        <SearchIcon/>
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />

                                </FormControl>
                                <FormControl fullWidth>
                                    <FormControlLabel
                                        control={<Switch
                                            checked={this.state.showParOnly}
                                            onChange={
                                                () => {
                                                    this.setState({showParOnly: !this.state.showParOnly})
                                                }
                                            }
                                            color="primary"
                                            name="checkedB"
                                        />}
                                        label="Show Participating Facilities Only"
                                    />


                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <MaterialTable options={{
                                    search: false,
                                    actionsColumnIndex: -1,
                                    headerStyle: {
                                        backgroundColor: '#01579b',
                                        color: '#FFF'
                                    }
                                }}
                                               actions={[
                                                   {
                                                       icon: 'done',
                                                       tooltip: 'Select Hospital',
                                                       onClick: this.handleFacilitySelect
                                                   }
                                               ]}
                                               columns={[
                                                   {field: "entryCode", title: "NPI"},
                                                   {field: "entryName", title: "Hospital"},
                                                   {field: "state", title: "State"},
                                                   {field: "planParticipant", title: "Plan Participant"},
                                               ]}

                                               data={this.state.searchResults}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    {/*<DialogActions>*/}

                    {/*    <Button onClick={close} color="primary">*/}
                    {/*        Cancel*/}
                    {/*    </Button>*/}
                    {/*    <Button onClick={close} color="primary">*/}
                    {/*        Choose*/}
                    {/*    </Button>*/}
                    {/*</DialogActions>*/}
                </Dialog>
            </>
            
        )
    }
}

HospitalSelector.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    selectedFacility: PropTypes.object,
    actions: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};


function mapHospitalSelectorStateToProps(state) {
    return {
        member: state.app.selectedMember,
        selectedFacility: state.app.selectedFacility,
        hp: state.app.selectedHP,
        selector: state.hospitalSelector,

    };
}

function mapHospitalSelectorDispatchToProps(dispatch) {
    return {actions: bindActionCreators(FormActions, dispatch)};
}

const HospitalSelectorDialog = connect(mapHospitalSelectorStateToProps, mapHospitalSelectorDispatchToProps)(HospitalSelector);


class HospitalSelectorWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            refreshed: false,
            classes: makeStyles((theme) => ({
                    root: {
                        padding: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: "100%",
                    },
                    input: {
                        marginLeft: theme.spacing(1),
                        flex: 1,
                    },
                    iconButton: {
                        padding: 10,
                    },
                    divider: {
                        height: 28,
                        margin: 4,
                    },
                    container: {
                        display: 'flex',
                        alignItems: 'center',
                        width: "100%",
                    }
                }

            ))
        };

        if (props.value) {

            this.fetchFacilityByNPI(props.value);
        }
        this.fetchFacilityByNPI = this.fetchFacilityByNPI.bind(this);
        this._onChange = this._onChange.bind(this)
    }


    fetchFacilityByNPI(npi) {
        this.props.actions.fetchFacilityByNpi(npi);
    }

    _onChange(value) {
        this.props.actions.fetchFacilityByNpi(value);
        this.props.onChange(value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value && prevState.refreshed === false) {
            if (nextProps.form.facilities) {
                if (!(nextProps.value in nextProps.form.facilities)) {
                    if (!isNaN(nextProps.value)) {
                        nextProps.actions.fetchFacilityByNpi(nextProps.value)
                        return {refreshed: true}
                    }
                }
            } else {
                if (!isNaN(nextProps.value)) {
                    nextProps.actions.fetchFacilityByNpi(nextProps.value)
                    return {refreshed: true}
                }

            }
        }

        if (nextProps.form.facilities) {
            let facilities = nextProps.form.facilities;
            return {facility: facilities[nextProps.value]}
        }
        return null
    };

    render() {
        const {
            id,
            required,
            readonly,
            disabled,
            value,
            label,
            onFocus,
            onBlur,
            onChange,
            options,
            autofocus,
            schema,
            form,
            facilities
        } = this.props;

        return (
            <Grid container className={this.state.classes.root}>
                <FormControl
                    fullWidth={true}
                    id={id}
                >
                    <TextField value={this.state.facility ? this.state.facility.entryName : value}
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               disabled={disabled || readonly}
                               autoFocus={autofocus}
                               required={required}
                               onClick={() => this.setState({open: true})}
                               label={label || schema.title}
                               onChange={this._onChange}
                               InputProps={{
                                   endAdornment: (
                                       <InputAdornment>
                                           <IconButton onClick={() => this.setState({open: true})}>
                                               <SearchIcon />
                                           </IconButton>
                                       </InputAdornment>
                                   )
                               }}
                    />
                    {/*{JSON.stringify(this.state)}*/}
                </FormControl>
                <HospitalSelectorDialog
                    open={this.state.open}
                    close={() => this.setState({open: false})}
                    actions={this.props.actions}
                    onChange={this._onChange}
                    facility={this.props.selectedFacility}/>
            </Grid>

        )
    }

}

HospitalSelectorWidget.propTypes = {
    open: PropTypes.bool,
};


function mapStateToProps(state) {
    return {
        member: state.app.selectedMember,
        selectedFacility: state.app.selectedFacility,
        hp: state.app.selectedHP,
        form: state.hospitalSelector.form,

    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(FormActions, dispatch)};
}

const ReduxWrapped = connect(mapStateToProps, mapDispatchToProps)(HospitalSelectorWidget);

export default (props) => {
    return (
        <ReduxWrapped {...props} />
    )
};