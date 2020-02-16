import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";

import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  onDeleteExperience = exp_id => {
    this.props.deleteExperience(exp_id);
  };
  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id} style={{ fontSize: "24px" }}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
          {!!exp.to ? (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          ) : (
            "Until Now"
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => this.onDeleteExperience(exp._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience credentials</h4>
        <table className="table">
          <thead>
            <tr style={{ fontSize: "24px" }}>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{experience}</tbody>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);
