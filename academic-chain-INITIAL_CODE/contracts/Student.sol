// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Student {
    uint public count = 0;
    struct StudentInfo {
        string name;
        string mothersName;
        uint256 dateOfBirth;
        string result;
    }

    mapping(string => StudentInfo) AllStudents;

    // Event for Student Data Added
    event StudentCreated(
        string id,
        string name,
        string mothersName,
        uint256 dateOfBirth
    );

    // Event for Student Result Added
    event ResultCreated(
        string id,
        string result
    );

    // function to add student info
    // @params: id, name, mothers name, date of birth, prn number and branch
    // @return: none, emits StudentCreated event
    function add_student_info(string memory _id, string memory _name, string memory _mothersName, uint256 _dateOfBirth) public {
        count++;
        AllStudents[_id].name = _name;
        AllStudents[_id].mothersName = _mothersName;
        AllStudents[_id].dateOfBirth = _dateOfBirth;
        emit StudentCreated(_id, _name, _mothersName, _dateOfBirth);
    }

    // function to add student info
    // @params: id, result
    // @return: none, emits ResultCreated event
    function add_student_result(string memory _id,  string memory _name, string memory _mothersName, uint256 _dateOfBirth, string memory _result) public {
        AllStudents[_id].name = _name;
        AllStudents[_id].mothersName = _mothersName;
        AllStudents[_id].dateOfBirth = _dateOfBirth;
        AllStudents[_id].result = _result;
        emit ResultCreated(_id, _result);
    }

    // function to fetch student info
    // @params: id
    // @return: all student info
    function get_student_info(string memory _id) public view returns(string memory name, string memory mothersName, uint256 dateOfBirth){
        name = AllStudents[_id].name;
        mothersName = AllStudents[_id].mothersName;
        dateOfBirth = AllStudents[_id].dateOfBirth;
    }

    // function to fetch student result
    // @params: id
    // @return: student result
    function get_student_result(string memory _id) public view returns(string memory name, string memory mothersName, uint256 dateOfBirth, string memory result){
        name = AllStudents[_id].name;
        mothersName = AllStudents[_id].mothersName;
        dateOfBirth = AllStudents[_id].dateOfBirth;
        result = AllStudents[_id].result;
    }
}