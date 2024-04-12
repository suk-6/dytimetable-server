const ComciganTeacherParser = require('./teacher-parser');

class TeacherService {
    constructor(parser = new ComciganTeacherParser()) {
        this.parser = parser;
    }

    async getTeachers() {
        return await this.parser.getTeachers();
    }
}

module.exports = TeacherService;