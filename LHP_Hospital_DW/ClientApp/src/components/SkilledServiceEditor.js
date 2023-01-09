import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from "prop-types";
import React, {Component, useState} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import Form from "@rjsf/material-ui";
import {withTheme} from "@rjsf/core";
import {DateOnly} from '../Util'
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {KeyboardDatePicker} from "@material-ui/pickers";
import Paper from "@material-ui/core/Paper";
import {CustomForm} from "./CustomForm";

function fromJSONDate(jsonDate) {
    return jsonDate ? jsonDate.slice(0, 19) : "";
}


function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function toJSONDate(dateString) {
    if (dateString) {
        let d = new Date(dateString)

        return `${d.getFullYear()}-${pad(d.getMonth(), 2)}-${pad(d.getDay() + 1, 2)}`
    }
}

const schema = require('../schema/SkilledNursingSchema.json')
const uiSchema = require('../schema/SkilledNursingUISchema.json')

const datePicker = (props) => {
    const {
        id,
        value,
        required,
        disabled,
        readonly,
        label,
        autofocus,
        onChange,
        onBlur,
        onFocus,
        schema,
    } = props;
    // const [selectedDate, handleDateChange] = useState(new Date());
    return (
        <FormControl fullWidth={true} required={required}>
            <KeyboardDatePicker
                //label={label || schema.title}
                autoOk
                clearable
                showTodayButton
                inputVariant="outlined"
                id={id}
                value={value ? new Date(value) : undefined}
                required={required}
                disabled={disabled || readonly}
                autoFocus={autofocus}
                //InputAdornmentProps={{ position: "start" }}
                onChange={value => {
                    onChange(toJSONDate(value) || undefined)
                }
                }

                onBlur={onBlur}
                onFocus={onFocus}
                format="yyyy-MM-dd">

            </KeyboardDatePicker>
            <Button onClick={() => onChange(undefined)}>Clear</Button>
        </FormControl>

    )
}


const Json = ({data}) => <pre>{JSON.stringify(data, null, 4)}</pre>;

//const Form = withTheme(theme)

class SkilledServiceEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                "Member Information": {
                    "first_name": this.props.patient ? this.props.patient.firstName : "",
                    "last_name": this.props.patient ? this.props.patient.lastName : "",
                    "facility": this.props.facility ? this.props.facility.entryName : "",
                }
            }
        }
        this.handleClose = this.handleClose.bind(this)
    }

    onSubmit = ({formData}, e) => console.log("Data submitted: ", formData);
    handleChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({[name]: value});
        }
    }

    handleClose() {
        this.props.HPActions.toggleAcuteModel()
    }

    render() {
        let formData = {
            "Member Information": {
                "first_name": this.props.patient ? this.props.patient.firstName : "",
                "last_name": this.props.patient ? this.props.patient.lastName : "",
                "facility": this.props.facility ? this.props.facility.entryName : "",
            }
        };


        return (
            <Dialog fullScreen
                //    open={true}
                    open={this.props.show}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title">
                <DialogContent>
                    <AppBar>
                        <Toolbar>
                            <Grid justify="space-between"
                                  alignItems="center"
                                  container>
                                <Grid item>
                                    <IconButton edge="start" color="inherit"

                                                onClick={this.handleClose}
                                                aria-label="close">
                                        <CloseIcon/>
                                    </IconButton>
                                </Grid>

                                <Grid item>
                                    <Typography variant="h6">
                                        {this.props.patient ? `(${this.props.patient.lastName}, ${this.props.patient.firstName}) - ${DateOnly(this.props.patient.dob)}` : 'UNKNOWN'}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button autoFocus color="inherit">
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                    <div style={{marginTop: 100, maxWidth: "70%", margin: "auto"}}>
                        <CustomForm
                            //widgets={{date: datePicker}}
                            schema={schema}
                            uiSchema={uiSchema}
                            onChange={(f) => this.setState({formData: f.formData})}
                            formData={this.state.formData}
                            onSubmit={this.onSubmit}
                            onError={(f) => console.log(f)}>
                            <Button variant="contained" type="submit">Save</Button>

                        </CustomForm>
                        <Paper style={{margin: 20, padding: 20}}>
                            <Json data={this.state.formData}/>
                        </Paper>
                    </div>
                </DialogContent>
            </Dialog>

        )
    }

}

SkilledServiceEditor.propTypes = {
    HPActions: PropTypes.object,
}

function mapStateToProps(state) {
    return {
        show: state.app.showSkilledModal,
        patient: state.app.selectedPatient,
        facility: state.app.selectedFacility,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        HPActions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SkilledServiceEditor)