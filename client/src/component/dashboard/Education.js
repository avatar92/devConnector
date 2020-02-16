import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";

import { deleteEducation } from "../../actions/profileActions";

class Education extends Component {
  onDeleteEducation = edu_id => {
    this.props.deleteEducation(edu_id);
  };
  render() {
    const education = this.props.education.map(edu => (
      <tr key={edu._id} style={{ fontSize: "24px" }}>
        <td>{edu.school}</td>
        <td>{edu.degree}</td>
        <td>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
          {!!edu.to ? (
            <Moment format="YYYY/MM/DD">{edu.to}</Moment>
          ) : (
            "Until Now"
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => this.onDeleteEducation(edu._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Education credentials</h4>
        <table className="table">
          <thead>
            <tr style={{ fontSize: "24px" }}>
              <th>school</th>
              <th>degree</th>
              <th>Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{education}</tbody>
        </table>
      </div>
    );
  }
}

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteEducation })(Education);
