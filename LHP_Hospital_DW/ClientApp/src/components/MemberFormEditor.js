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
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import Form from "@rjsf/material-ui";
import {DateOnly} from '../Util'
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {customFields, customWidgets} from "./CustomForm";
import cleanDeep from "clean-deep";
import AceEditor from "react-ace";
import FormLoadingSpinner from "./FormLoadingSpinner";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Json = ({data, onChange}) => <AceEditor onChange={onChange} width="100%" theme="github" mode="json"
                                              value={JSON.stringify(data, null, 4)}/>;


class MemberFormEditor extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseAlert = this.handleCloseAlert.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitSuccess = this.onSubmitSuccess.bind(this)
        this.onSubmitError = this.onSubmitError.bind(this)
        this.SaveDialog = this.SaveDialog.bind(this)
        this.ErrorDialog = this.ErrorDialog.bind(this)
        this.state = {
            close: false,
            statusMessage: null,
            formData: {},
            statusModal: false,
            showUnsavedDataAlert: false,
            showErrorAlert: false,
            formChanged: false,
        }
    }

    onSubmitSuccess(response) {
        // console.info(response)
        // console.info("Saved!")
        this.props.actions.fetchMemberFormHeaders(this.props.member.memberRoleId);
        if (this.props.selectedHP) {
            this.props.actions.fetchActiveAcuteTransfers(this.props.selectedHP.dictHealthPlanId)
        }
        this.setState({changed: false})
        if (this.state.close) {
            this.setState({close: false});
            this.props.actions.hideMemberFormEditor();
        }
    }

    onSubmitError(response) {
        this.setState({error: true, errorMessage: response})

    }

    onSubmit({formData}, e) {
        e.preventDefault()
        this.setState({formData: formData})
        let body = {
            memberRoleId: this.props.member.memberRoleId,
            formData: formData,
            dictFormId: this.props.form.dictFormId,
        };
        this.props.actions.setCurrentFormData(formData)
        if (this.props.currentForm) {
            body.memberFormHeaderId = this.props.currentForm.memberFormHeaderId;
        }
        this.props.actions.saveMemberForm(body, this.onSubmitSuccess, this.onSubmitError());
    }


    handleClose() {
        if (!this.props.disabled) {
            this.setState({showUnsavedDataAlert: true})
        } else {
            this.props.actions.hideMemberFormEditor();
        }


    }

    handleCloseAlert() {
        this.setState({showUnsavedDataAlert: true})
    }

    SaveDialog() {
        return (
            <Dialog
                open={this.state.showUnsavedDataAlert}
                onClose={(e) => this.setState({showUnsavedDataAlert: false})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"You may have unsaved data"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You may have unsaved data. Please save your data before closing the form.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => this.setState({showUnsavedDataAlert: false})} color="primary" autoFocus>
                        CANCEL
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                            this.setState({showUnsavedDataAlert: false, changed: false})
                            this.props.actions.hideMemberFormEditor();
                        }} color="secondary" autoFocus>
                        I Understand close anyway
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    ErrorDialog() {
        return (
            <Dialog
                open={this.state.showErrorAlert}
                onClose={(e) => this.setState({showErrorAlert: false})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"There are errors on the form."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.errorMessage}
                        <br/>
                        <ul>

                            {this.state.errors ? this.state.errors.map((error, idx) =>
                                (<li key={idx}>{error.stack}</li>)
                            ) : null}

                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={(e) => this.setState({showErrorAlert: false})} color="primary" autoFocus>
                        OK
                    </Button>

                </DialogActions>
            </Dialog>
        )
    }

    render() {
        let formData = this.state.formData;
        let schema = {};
        let uiSchema = {};
        //this.props.form && JSON.parse(this.props.form.formSchema)
        if (this.props.show && this.props.form) {
            schema = JSON.parse(this.props.form.formSchema);
            uiSchema = JSON.parse(this.props.form.formUischema);
            if (this.props.currentForm) {
                if (typeof this.props.currentForm.formData == "object") {
                    //formData = this.props.currentForm.formData
                    this.setState({formData: this.props.currentForm.formData})
                } else {
                    this.setState({formData: cleanDeep(JSON.parse(this.props.currentForm.formData))})
                    //formData = cleanDeep(JSON.parse(this.props.currentForm.formData))
                }

            } else {
                formData = {};
            }
        }

        return (
            <React.Fragment>
                <FormLoadingSpinner/>
                <this.SaveDialog/>
                <this.ErrorDialog/>
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
                                        {/*<Typography>{this.props?.currentForm?.memberFormHeaderId}</Typography>*/}
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">
                                            {this.props.member ? `(${this.props.member.lastName}, ${this.props.member.firstName}) - ${DateOnly(this.props.member.dob)}` : 'UNKNOWN'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                        <div style={{marginTop: 60}}>
                            <Form
                                omitExtraData
                                id="lhpForm"
                                className={schema.className}
                                ref={(form) => {
                                    this.formRef = form;
                                }}
                                fields={customFields}
                                widgets={customWidgets}
                                disabled={this.props.disabled}
                                schema={schema}
                                uiSchema={uiSchema}
                                // onBlur={(event) => {
                                //     this.setState({changed: true})
                                //     return event
                                // }
                                // }
                                formData={formData}
                                formContext={formData}
                                onSubmit={(d,e) => 
                                {
                                    e.preventDefault()
                                    this.onSubmit(d, e)
                                }}
                                onError={errors => this.setState({
                                    errors: errors,
                                    showErrorAlert: true,
                                    errorMessage: "You have data validation issues and the form cannot save. Please address the issues below and re-save the form."
                                })}>
                                {this.props.disabled ?
                                    (<ButtonGroup>
                                        <Button color="primary" variant="contained"
                                                onClick={() => this.handleClose()}>Close</Button>
                                    </ButtonGroup>) :
                                    <ButtonGroup>
                                        <Button color="primary" onClick={() => {
                                            this.formRef.submit();
                                            this.setState({close: false});

                                        }} variant="contained">Save</Button>
                                        <Button color="secondary"
                                                variant="contained"
                                                onClick={() => {
                                                    this.formRef.submit();
                                                    this.setState({close: true});

                                                }}
                                        >Save & Close</Button>
                                    </ButtonGroup>

                                }

                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            </React.Fragment>

        )
    }

}

MemberFormEditor.propTypes = {
    actions: PropTypes.object,
    form: PropTypes.object,
    member: PropTypes.object,
    currentForm: PropTypes.object,
    disabled: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        show: state.app.showMemberFormEditor,
        member: state.app.selectedMember,
        facility: state.app.selectedFacility,
        form: state.app.dictForm,
        currentForm: state.app.currentMemberForm,
        disabled: state.app.formEditorDisabled,
        selectedHP: state.app.selectedHealthPlan,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberFormEditor)