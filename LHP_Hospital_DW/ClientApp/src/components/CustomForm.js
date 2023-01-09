import Form from "@rjsf/material-ui";
import React, {Component, useState} from 'react';
import {DateTimeWidget, DateWidget} from '../form/DateTimeWidget'
import MemberTable from "./MemberTable";
import HospitalSelectorWidget from "../form/HospitalSelectorWidget";
import TextareaWidget from "../form/TextAreaWidget";
import SelectWidget from "../form/SelectWidget";
import ObjectField from "@rjsf/core/lib/components/fields/ObjectField";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import {cloneDeep} from "lodash"
import ValueViewerWidget from "../form/ValueViewerWidget";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from "../actions/HealthPlanActions";
import {connect} from "react-redux";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import cleanDeep from "clean-deep";
import EnrollmentWidget from "../form/EnrollmentWidget";
import HealthPlanWidget from "../form/HealthPlanWidget";
import AgeWidget from "../form/AgeWidget";
import PreviousAdmissionsWidget from "../form/PreviousAdmissionsWidget";
import OpportunitiesWidget from "../form/OpportunitiesWidget";


function ExpandableObjectField(props) {
    const [isExpanded, setExpanded] = useState(props.uiSchema['ui:expanded'] ? true : false);
    const objectProps = cloneDeep(props);
    objectProps.schema.title = '';
    return (
        <>
            <ExpansionPanel expanded={isExpanded} onChange={() => setExpanded(isExpanded ? false : true)}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    style={{background: "#7986cb"}}
                    aria-controls="panel1bh-content"                    
                    id={props.id}
                >
                    <Typography>
                        {props.schema.title}
                    </Typography>

                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>
                        <ObjectField {...objectProps}/>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </>
    )
}


function TitleField(props) {
    return (
        <>
            <Box mb={1} mt={1} id={props.id} hidden={props.title == '' ? true : false}>
                <Typography variant="h5">{props.title}</Typography>
                <Divider/>
            </Box>
        </>
    )
}


function InfoField(props) {
    
    
    
}


export const customWidgets = {
    TextareaWidget: TextareaWidget,
    DateWidget: DateWidget,
    DateTimeWidget: DateTimeWidget,
    MemberInformation: MemberTable,
    HospitalSelector: HospitalSelectorWidget,
    SelectWidget: SelectWidget,
    ValueViewerWidget: ValueViewerWidget,
    EnrollmentWidget: EnrollmentWidget,
    HealthPlanWidget: HealthPlanWidget,
    AgeWidget: AgeWidget,
    PreviousAdmissionsWidget: PreviousAdmissionsWidget,
    OpportunitiesWidget: OpportunitiesWidget,
};

export const customFields = {
    ExpandableObjectField: ExpandableObjectField,
    TitleField: TitleField
    //ObjectField: customObjectField
};

export class CustomForm extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let formData = {};
        let schema = {};
        let uiSchema = {};
        //this.props.form && JSON.parse(this.props.form.formSchema)
        if (this.props.show && this.props.form) {
            schema = JSON.parse(this.props.form.formSchema);
            uiSchema = JSON.parse(this.props.form.formUischema);
            if (this.props.currentForm) {
                if (typeof this.props.currentForm.formData == "object") {
                    formData = this.props.currentForm.formData
                } else {
                    formData = cleanDeep(JSON.parse(this.props.currentForm.formData))
                }

            } else {
                formData = {};
            }
        }
        return (
            <Form
                id="lhpForm"
                widgets={customWidgets}
                fields={customFields}
                disabled={this.props.disabled}
                schema={schema}
                uiSchema={uiSchema}
                //onChange={(f) => this.props.actions.setCurrentFormData(f.formData)}
                formData={formData}
                onSubmit={this.onSubmit}
                onError={e => console.log(e)}
                formContext={formData}
                {...this.props}
                

            >
                {this.props.disabled ?
                    (<ButtonGroup>
                        <Button color="primary" variant="contained"
                                onClick={() => this.handleClose()}>Close</Button>
                    </ButtonGroup>) :
                    <ButtonGroup>
                        <Button color="primary" type="submit" variant="contained">Save</Button>
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
            
        )
    }
}

CustomForm.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomForm)