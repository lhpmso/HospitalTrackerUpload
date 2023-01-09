import AppBar from "@material-ui/core/AppBar";
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
import {DateOnly} from '../Util'
import cleanDeep from "clean-deep";
import AceEditor from "react-ace";
import FormLoadingSpinner from "./FormLoadingSpinner";
import {Document, Page, PDFViewer, StyleSheet, Text, View} from '@react-pdf/renderer';

const Json = ({data, onChange}) => <AceEditor onChange={onChange} width="100%" theme="github" mode="json"
                                              value={JSON.stringify(data, null, 4)}/>;


const styles = StyleSheet.create({
    body: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        backgroundColor: "#D3D3D3",
        borderRadius: "2px",
        marginBottom: "5px",
        padding: 10, 


    },
    section: {
        //backgroundColor: "#edeff8",
        padding: "5px",
        borderRadius: "10px",
        marginBottom: "5px",
        borderStyle: "5px solid black"
    },
    sectionValues: {
        backgroundColor: "white",
        padding: "5px",
        marginBottom: "4px",
        borderStyle: "solid",
        //borderRadius: "5px"
    },
    title: {
        fontSize: 24,
        textAlign: 'left',
        fontFamily: 'Times-Roman',
        marginBottom: "5px",
    },
    valueTitle: {
        fontSize: 14,
        textAlign: 'left',
        fontFamily: 'Times-Roman',
        marginBottom: "2px",
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        //marginBottom: 40,
    },
    info: {
        fontSize: 12,
        textAlign: 'left',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Times-Roman'
    },
    text: {
        marginLeft: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'left',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
});


const ParseFormSection = (keyName, formData, level) => {
    let l = level ? level : 1

    let section = formData[keyName]

    return (
        <View style={styles.section}>
            {l === 1 ? (

                    <Text style={styles.header}>
                        {titleCase(keyName)}
                    </Text>
                ) :
                <View style={styles.sectionValues}>
                    <Text style={styles.valueTitle}>
                        {isNaN(keyName) ? titleCase(keyName) : 'Item ' + keyName}
                    </Text>
                </View>}
            {typeof (section) == 'object' ?

                Object.keys(section).map((keyName1, i) => {
                    let sectionValue = section[keyName1]
                    if (typeof sectionValue == 'object') {
                        return ParseFormSection(keyName1, section, l + 1)
                    }
                    return (
                        <View style={styles.sectionValues}>
                            <Text style={styles.valueTitle}>
                                <b>{isNaN(keyName1) ? titleCase(keyName1) : 'Item ' + keyName1}</b>: {section[keyName1]}
                            </Text>
                        </View>
                    )
                })

                : (
                    <View style={styles.sectionValues}>
                        <Text style={styles.valueTitle}>
                            <b>{titleCase(keyName)}</b> : {section}
                        </Text>
                    </View>
                )}
        </View>
    )
}

const titleCase = (s) => {
    let sentence = s.toLowerCase().split("_");
    for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }

    return sentence.join(" ");
}

class MemberFormViewer extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            close: false,
            statusMessage: null,
            statusModal: false,
            showUnsavedDataAlert: false,
            showErrorAlert: false,
            formChanged: false,
            sections: this.props.currentForm ? Object.keys(this.props.currentForm.formData) : []
        }

    }


    handleClose() {
        this.props.actions.hideMemberFormViewer();
    }

    render() {
        let formData = {};
        let sections = []
        if (this.props.show && this.props.form) {
            if (this.props.currentForm) {
                if (typeof this.props.currentForm.formData == "object") {
                    formData = this.props.currentForm.formData

                } else {
                    formData = cleanDeep(JSON.parse(this.props.currentForm.formData))

                }

            } else {
                formData = {};
            }
            sections = Object.keys(formData).filter(x => x !== 'form_status')
        }

        return (
            <React.Fragment>
                <FormLoadingSpinner/>
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
                                            {this.props.member ? `(${this.props.member.lastName}, ${this.props.member.firstName}) - ${DateOnly(this.props.member.dob)}` : 'UNKNOWN'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                        <div style={{marginTop: 60, height: "calc(100vh - 100px)"}}>
                            <PDFViewer width={"100%"} height={"100%"}>
                                <Document>
                                    <Page size="letter" style={styles.body}>
                                        {this.patientView()}
                                        {sections.slice(0, 1).map((keyName, i) => (
                                            ParseFormSection(keyName, formData, 1, i)
                                        ))}
                                    </Page>
                                    {sections.slice(1, sections.length).map((keyName, i) => (
                                        <Page size="letter"
                                              style={styles.body}>
                                            {this.patientView()}

                                            {ParseFormSection(keyName, formData, 1, i)}</Page>
                                    ))}

                                </Document>
                            </PDFViewer>

                        </div>
                    </DialogContent>
                </Dialog>
            </React.Fragment>

        )
    }

    patientView() {
        return <View style={styles.sectionHeader}>
            <Text style={styles.title}>
                {this.props.member ? this.props.member.lastName + ', ' + this.props.member.firstName + ' (' + this.props.member.dob.split("T")[0] + ')' : ""}
            </Text>
            <Text style={styles.info}>
                DOB: {this.props.member ? this.props.member.dob.split("T")[0] : ""} • Gender: {this.props.member ? this.props.member.gender : ""} • Enrollment Date: {this.props.member ? this.props.member.startDate.split("T")[0] : ""}
            </Text>
            <Text style={styles.header}>
                {this.props.currentForm ? this.props.currentForm?.entryName.toUpperCase() : ""}
            </Text>
            <Text style={styles.info}>
                Author: {this.props.currentForm ? this.props.currentForm.creator : ""} • Created: {this.props.currentForm ? this.props.currentForm.createdDate.split("T")[0] : ""}
            </Text>

            

        </View>;
    }
}

MemberFormViewer.propTypes = {
    actions: PropTypes.object,
    form: PropTypes.object,
    member: PropTypes.object,
    currentForm: PropTypes.object,
    disabled: PropTypes.bool,
    show: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        show: state.app.showMemberFormViewer,
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

export default connect(mapStateToProps, mapDispatchToProps)(MemberFormViewer)