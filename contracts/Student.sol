// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Student {
    uint public count = 0;
    struct StudentInfo {
        string name;
        string mothersName;
        uint256 dateOfBirth;
        string prnNumber;
        string branch;
//        string[] result;
    }

    mapping(string => StudentInfo) AllStudents;

    event StudentCreated(
        string id,
        string name,
        string mothersName,
        uint256 dateOfBirth,
        string prnNumber,
        string branch
    );

    // event ResultCreated(
    //     string id,
    //     string result
    // );

    function add_student_info(string memory _id, string memory _name, string memory _mothersName, uint256 _dateOfBirth, string memory _prnNumber, string memory _branch) public {
        count++;
        AllStudents[_id].name = _name;
        AllStudents[_id].mothersName = _mothersName;
        AllStudents[_id].dateOfBirth = _dateOfBirth;
        AllStudents[_id].prnNumber = _prnNumber;
        AllStudents[_id].branch = _branch;
        emit StudentCreated(_id, _name, _mothersName, _dateOfBirth, _prnNumber, _branch);
    }

    // function add_student_result(string memory _id, string memory _result) public {
    //     AllStudents[_id].result.push(_result);
    //     emit ResultCreated(_id, _result);
    // }

    function get_student_info(string memory _id) public view returns(string memory name, string memory mothersName, uint256 dateOfBirth, string memory prnNumber, string memory branch){
        name = AllStudents[_id].name;
        mothersName = AllStudents[_id].mothersName;
        dateOfBirth = AllStudents[_id].dateOfBirth;
        prnNumber = AllStudents[_id].prnNumber;
        branch = AllStudents[_id].branch;
    }

    // function get_student_result(string memory _id) public view returns(string[] memory result){
    //     result = AllStudents[_id].result;
    // }
}