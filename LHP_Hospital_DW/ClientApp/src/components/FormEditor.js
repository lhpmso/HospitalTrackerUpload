import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import {CustomForm} from "./CustomForm";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import cleanDeep from "clean-deep";
import SearchIcon from "@material-ui/icons/Search";

const schema = require('../schema/AcuteTransferSchema.json');
const uiSchema = require('../schema/AcuteTransferUISchema.json');
const formData = require('../schema/TestFormData');


class FormEditor extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.getSortedFields = this.getSortedFields.bind(this);
        let order = this.getSortedFields(schema, uiSchema);
        uiSchema['ui:order'] = order.map(m => m.id);
        this.state = {
            fields: order,
            schema: schema,
            uiSchema: uiSchema,
            formData:  cleanDeep(formData)
        }

    }

    getSortedFields(schema, uiSchema) {
        let k = [];
        if (uiSchema.hasOwnProperty('ui:order')) {
            let uiOrder = uiSchema['ui:order'];
            uiOrder.map(v => {
                if (schema.properties.hasOwnProperty(v)) {
                    k.push({id: v, text: schema.properties[v].title ? schema.properties[v].title : v})
                }
            });
            return k
        }

        for (let key in schema.properties) {
            if (schema.properties.hasOwnProperty(key)) {
                k.push({id: key, text: schema.properties[key].title ? schema.properties[key].title : key})
            }
        }
        return k;
    };

    onSubmit = ({formData}, e) => console.log("Data submitted: ", formData);
    handleChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({[name]: value});
        }
    };

    handleClose() {
        this.props.actions.toggleAcuteModel()
    }

    handleSort(items) {
        let newUiSchema = this.state.uiSchema
        newUiSchema['ui:order'] = items.map(m => m.id);

        this.setState({fields: items, uiSchema: {}})
        this.setState({uiSchema: newUiSchema})

    }

    render() {
        //console.log(fields());
        return (
            <Grid container style={{marginTop: 100, margin: "auto"}} spacing={6}>
                <Grid>
                    <Button color="secondary"
                            variant="contained"
                            startIcon={<SearchIcon/>}
                            onClick={() => this.props.actions.toggleMemberSelector()}>
                        Search Member
                    </Button>
                </Grid>
                <Grid item xs={12} style={{marginTop: 100, padding: 20}}>
                    <CustomForm
                        omitExtraData
                        schema={this.state.schema}
                        formContext={this.state.formData}
                        uiSchema={this.state.uiSchema}
                        //onChange={(f) => this.setState({formData: f.formData})}
                        onBlur={(id, value) => console.log(`${id} - ${value}`)}
                        formData={this.state.formData}
                        onSubmit={this.onSubmit}
                        onError={(e) => console.log(e)}>
                        <Button type="submit" variant="contained">Save</Button>

                    </CustomForm>

                </Grid>
                {/*<Grid item xs={6} style={{marginTop: 100, padding: 20, maxHeight: 600, overflow: "auto"}}>*/}
                {/*    <ExpansionPanel>*/}
                {/*        <ExpansionPanelSummary*/}
                {/*            expandIcon={<ExpandMoreIcon/>}*/}
                {/*            aria-controls="panel1a-content"*/}
                {/*            id="panel1a-header"*/}
                {/*        >*/}
                {/*            <Typography>Field Order</Typography>*/}
                {/*        </ExpansionPanelSummary>*/}
                {/*        <ExpansionPanelDetails style={{width: "100%"}}>*/}
                
                {/*            <SortableList*/}
                {/*                style={{width: "100%"}}*/}
                {/*                items={this.state.fields}*/}
                {/*                //onSortEnd={}*/}
                {/*                setItems={this.handleSort}*/}
                {/*                useDragHandle={true}*/}
                {/*                lockAxis="y"/>*/}
                
                {/*        </ExpansionPanelDetails>*/}
                {/*    </ExpansionPanel>*/}
                {/*    <ExpansionPanel>*/}
                {/*        <ExpansionPanelSummary*/}
                {/*            expandIcon={<ExpandMoreIcon/>}*/}
                {/*            aria-controls="panel1a-content"*/}
                {/*            id="panel1a-header"*/}
                {/*        >*/}
                {/*            <Typography>Form Data</Typography>*/}
                {/*        </ExpansionPanelSummary>*/}
                {/*        <ExpansionPanelDetails style={{width: "100%"}}>*/}
                {/*            <Json onChange={data => {*/}
                {/*                this.setState({formData: JSON.parse(data)})*/}
                {/*            }*/}
                {/*            }*/}
                {/*                  data={this.state.formData}/>*/}
                {/*        </ExpansionPanelDetails>*/}
                {/*    </ExpansionPanel>*/}
                
                {/*    <Paper style={{marginTop: 100}}>*/}
                {/*        <Typography>UI Schema</Typography>*/}
                {/*        <Json data={this.state.uiSchema}/>*/}
                {/*    </Paper>*/}
                {/*    <Paper style={{marginTop: 100}}>*/}
                {/*        <Typography>Form Schema</Typography>*/}
                {/*        <Json data={this.state.schema}/>*/}
                {/*    </Paper>*/}
                {/*</Grid>*/}
            </Grid>

        )
    }

}


FormEditor.propTypes = {
    actions: PropTypes.object,
};


function mapStateToProps(state) {
    return {
        show: state.app.showAcuteModal,
        patient: state.app.selectedMember,
        facility: state.app.selectedFacility,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormEditor)