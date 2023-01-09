import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Grid from "@material-ui/core/Grid";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import * as HealthPlanActions from '../actions/HealthPlanActions';
import {bindActionCreators} from "redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FolderIcon from '@material-ui/icons/Folder';
import * as NavTypes from "../actions/NavTypes"
class DictFormSelectorDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelected = this.handleSelected.bind(this);
        this.renderList = this.renderList.bind(this);
    }


    handleSelected(dictForm) {
        this.props.actions.setSelectedDictForm(dictForm);
    }

    renderList() {

    }

    render() {
        if (this.props.open) {
            this.actions.fetchDictForms();

        }


        return (
            <Dialog open={this.props.show} fullWidth>
                <DialogTitle>
                    <Grid justify="space-between"
                          alignItems="center"
                          container>
                        <Grid item>
                            <span>Select Form</span>
                        </Grid>
                        <Grid item>
                            <IconButton>
                                <CloseIcon onClick={() => {
                                    this.props.actions.setSideBarNav(NavTypes.NAV_MAIN)
                                    this.props.actions.toggleDictFormDialog()
                                }}/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {this.props.forms &&
                        this.props.forms.map((f) => {
                            return (
                                <ListItem key={f.dictFormHeaderId} dense button onClick={(e) => this.handleSelected(f)}>
                                    <ListItemIcon>
                                        <FolderIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={f.entryName}/>
                                </ListItem>
                            )
                        })}

                    </List>
                </DialogContent>
            </Dialog>
        )
    }
}

DictFormSelectorDialog.propTypes = {
    open: PropTypes.bool,
}


function mapStateToProps(state) {
    return {
        show: state.app.showDictFormDialog,
        member: state.app.selectedMember,
        forms: state.app.DictForms
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HealthPlanActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(DictFormSelectorDialog)