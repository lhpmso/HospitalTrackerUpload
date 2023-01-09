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
import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import Form from "@rjsf/material-ui";
import {DateOnly} from '../Util'
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {customFields, customWidgets} from "./CustomForm";
import cleanDeep from "clean-deep";
import FormLoadingSpinner from "./FormLoadingSpinner";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function MemberFormEditorV2(props) {
    const _ = require('lodash');
    //const formRef = React.createRef()
    const [formRef, setFormRef] = React.useState(null)
    const [close, setClose] = React.useState(false)
    const [formData, setFormData] = React.useState({})
    const [schema, setSchema] = React.useState({})
    const [uiSchema, setUiSchema] = React.useState({})

    const {
        selectedHP,
        member,
        disabled,
        form,
        show,
        currentForm,
        loading,
        currentMemberForm,
    } = props
    const {
        fetchMemberFormHeaders,
        fetchActiveAcuteTransfers,
        hideMemberFormEditor,
        setCurrentFormData,
        saveMemberForm,
    } = props.actions

    const {statusModel, setStatusModel} = React.useState(false)
    const [showUnsavedDataAlert, setShowUnsavedDataAlert] = React.useState(false)
    const [showErrorAlert, setShowErrorAlert] = React.useState(false)
    const [formChanged, setFormChanged] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [errors, setErrors] = React.useState(null)

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    const clearState = () => {
        //console.log("clearing state")
        setFormData({})
        setSchema({})
        setUiSchema({})
    }

    React.useEffect(() => {
        if (show && form) {
            setSchema(JSON.parse(form.formSchema))
            setUiSchema( JSON.parse(form.formUischema))
            if (currentForm) {
                if (currentForm.formData === "object") {
                    
                    setFormData(currentForm.formData)
                } else {
                    setFormData(cleanDeep(JSON.parse(currentForm.formData)))
                }

            } else {
                setFormData({})
            }
        }

    }, [currentForm, form])


    function onSubmitSuccess(response) {
        fetchMemberFormHeaders(member.memberRoleId);
        if (selectedHP) {
            fetchActiveAcuteTransfers(selectedHP.dictHealthPlanId)
        }
        // setFormChanged(false)
        if (close) {
            clearState()
            setClose(false)
            hideMemberFormEditor();
        }
    }

    function onSubmitError(response) {
        setErrors({error: true, errorMessage: response})
    }

    function onSubmit({formData}, e) {
        setFormData(formData)
        let body = {
            memberRoleId: member.memberRoleId,
            formData: formData,
            dictFormId: form.dictFormId,
        };
        //setCurrentFormData(formData)
        if (currentForm) {
            body.memberFormHeaderId = currentForm.memberFormHeaderId;
        }
        saveMemberForm(body, onSubmitSuccess, onSubmitError);
        setFormChanged(false)
    }

    function handleClose() {
        if (!disabled && formChanged) {
            setShowUnsavedDataAlert(true)
        } else {
            clearState()
            hideMemberFormEditor();
        }
    }

    function handleCloseAlert() {
        setShowUnsavedDataAlert(true)
    }

    function SaveDialog() {
        return (
            <Dialog open={showUnsavedDataAlert}
                    onClose={(e) => setShowUnsavedDataAlert(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"You may have unsaved data"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You may have unsaved data. Please save your data before closing the form.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => setShowUnsavedDataAlert(false)} color="primary" autoFocus>
                        CANCEL
                    </Button>
                    <Button variant="contained"
                            color="secondary"
                            onClick={(e) => {
                                clearState()
                                setShowUnsavedDataAlert(false)
                                setFormChanged(false)
                                hideMemberFormEditor();
                            }} color="secondary" autoFocus>
                        I Understand close anyway
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    function ErrorDialog() {
        return (
            <Dialog open={showErrorAlert}
                    onClose={(e) => setShowErrorAlert(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"There are errors on the form."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {errorMessage}
                        <br/>
                        <ul>

                            {errors ? errors.map((error, idx) =>
                                (<li key={idx}>{error.stack}</li>)
                            ) : null}

                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={(e) => setShowErrorAlert(false)} color="primary" autoFocus>
                        OK
                    </Button>

                </DialogActions>
            </Dialog>
        )
    }


    return (
        <React.Fragment>
            <FormLoadingSpinner/>
            <SaveDialog/>
            <ErrorDialog/>
            <Dialog fullScreen
                    open={show}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title">
                <DialogContent>
                    <AppBar>
                        <Toolbar>
                            <Grid justify="space-between"
                                  alignItems="center"
                                  container>
                                <Grid item>
                                    <IconButton edge="start" color="inherit"
                                                onClick={handleClose}
                                                aria-label="close">
                                        <CloseIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6">
                                        {member ? `(${member.lastName}, ${member.firstName}) - ${DateOnly(member.dob)}` : 'UNKNOWN'}
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
                                setFormRef(form)
                            }}
                            fields={customFields}
                            widgets={customWidgets}
                            disabled={disabled}
                            schema={schema}
                            uiSchema={uiSchema}
                            onBlur={(d, e) => {
                                if (!formChanged) setFormChanged(true)
                            }}
                            formData={formData}
                            // formContext={formData}
                            onSubmit={(d, e) => {
                                onSubmit(d, e)
                            }}
                            onChange={(d, e) => {
                                    setFormData(d.formData)
                            }}
                            onError={errors => {
                                setErrors(errors)
                                setShowErrorAlert(true)
                                setErrorMessage("You have data validation issues and the form cannot save. Please address the issues below and re-save the form.")
                            }
                            }>
                            {disabled ?
                                (<ButtonGroup>
                                    <Button color="primary" variant="contained"
                                            onClick={() => handleClose()}>Close</Button>
                                </ButtonGroup>) :
                                <ButtonGroup>
                                    <Button color="primary"
                                            onClick={() => {
                                                setClose(false)
                                                formRef.submit()
                                            }}
                                            variant="contained">Save</Button>
                                    <Button color="secondary"
                                            variant="contained"
                                            onClick={() => {
                                                setClose(true)
                                                formRef.submit();


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


MemberFormEditorV2.propTypes = {
    actions: PropTypes.object,
    form: PropTypes.object,
    member: PropTypes.object,
    currentForm: PropTypes.object,
    disabled: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        show: state.app.showMemberFormEditor,
        loading: state.app.loading,
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

export default connect(mapStateToProps, mapDispatchToProps)(MemberFormEditorV2)