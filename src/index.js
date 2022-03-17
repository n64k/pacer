/*
- Disable scroll to change value of field

*/

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function round(number, places) {
    return parseFloat(number.toFixed(2), 10);
}
function printMonth() {
    const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const d = new Date();
    let name = month[d.getMonth()];
    return name;
}

class Project extends React.Component {
    get hoursLeft() {
        return this.props.hoursAllotted - this.props.hoursWorked
    }
    get hoursToPace() {
        return round(this.hoursLeft / this.props.daysLeft)
    }
    get pacingDifference() {
        let dailyHoursTarget = this.props.hoursAllotted / this.props.workdays
        let target = dailyHoursTarget * this.props.daysWorked
        let difference = this.props.hoursWorked - target
        return difference
    }
    get printPacingDifference() {
        if (this.pacingDifference > 0 ) {
            return`You're ${round(this.pacingDifference)} hours ahead`
        } else {
            return `Your're ${round(Math.abs(this.pacingDifference))} hours behind`
        }   
    }
    render() {
        return (
            <div className="project">
                <p>id: {this.props.id}</p>
                <p>index: {this.props.index}</p>
                <label>
                    Project
                    <input
                        className="project-name"
                        type="text"
                        value={this.props.name}
                        onChange={this.props.onNameChange}
                    />    
                </label>
                <label>
                    Hours allotted
                    <input
                        type="number"
                        step="any"
                        value={this.props.hoursAllotted}
                        onChange={this.props.onHoursAllottedChange}
                    />    
                </label>
                <label>
                    Hours Worked
                    <input
                        type="number"
                        step="any"
                        value={this.props.hoursWorked}
                        onChange={this.props.onHoursWorkedChange}
                    />
                </label>
                <p>{this.hoursLeft} hours left</p>
                <p>{this.printPacingDifference}</p>
                <p>Average <span className="red">{this.hoursToPace}</span>  hours a day</p>
                <button onClick={this.props.onDeleteProject}>Delete Project</button>
                
            </div>
        );
    }
}

class Month extends React.Component {
    constructor(props) {
        super(props);
        this.emptyProjectTemplate = {
            name: "Untitled Project",
            hoursAllotted: 100,
            hoursWorked: 5,
            get id() {
                return Math.random()
            }
        }
        let month = JSON.parse(localStorage.getItem("month"));
        if (!month) {
            month = {
                name: printMonth(),
                workdays: 20,
                daysWorked: 0,
                projects: [
                    this.emptyProjectTemplate
                ],
            };
        }
        this.state = {
            name: month.name,
            workdays: month.workdays,
            daysWorked: month.daysWorked,
            projects: month.projects,
        };
        localStorage.setItem("month", JSON.stringify(month));
        console.log(this.state.projects)
    }
    
    get daysLeft() {
        return this.state.workdays - this.state.daysWorked
    }
    
    handleChange(e, property) {
        this.setState({
            [property]: e.target.value,
        });
    }
    handleNameChange(e, i) {
        let updatedProjects = this.state.projects.slice()
        updatedProjects[i].name = e.target.value
        this.setState(
            {projects: updatedProjects},
            () => localStorage.setItem("month", JSON.stringify(this.state))
        )
    }
    handleHoursAllottedChange(e, i) {
        let updatedProjects = this.state.projects.slice()
        updatedProjects[i].hoursAllotted = e.target.value
        this.setState(
            {projects: updatedProjects},
            () => localStorage.setItem("month", JSON.stringify(this.state))
        )
    }
    handleHoursWorkedChange(e, i) {
        let updatedProjects = this.state.projects.slice()
        updatedProjects[i].hoursWorked = e.target.value
        this.setState(
            {projects: updatedProjects},
            () => localStorage.setItem("month", JSON.stringify(this.state))
        )
    }
    
    createProject() {
        let updatedProjects = [...this.state.projects]
        updatedProjects.push({
                name: "Untitled Project",
                hoursAllotted: 100,
                hoursWorked: 5,
                id: Math.random()
            })
        this.setState(
            {projects: updatedProjects},
            () => localStorage.setItem("month", JSON.stringify(this.state))
        )
    }
    handleDeleteProject(e, i) {
        let updatedProjects = this.state.projects.slice()
        updatedProjects.splice(i, 1)
        console.log("DELETE")
        this.setState(
            {projects: updatedProjects},
            () => localStorage.setItem("month", JSON.stringify(this.state))
        )
    }

    renderProject(i) {
        return(
            <Project
                name={this.state.projects[i].name}
                onNameChange={(e) => {
                    this.handleNameChange(e, i)
                }}
                // key={i}
                key={this.state.projects[i].id}
                id={this.state.projects[i].id}
                index={i}
                workdays={this.state.workdays}
                daysWorked={this.state.daysWorked}
                daysLeft={this.daysLeft}
                // Hours Allotted
                hoursAllotted={this.state.projects[i].hoursAllotted}
                onHoursAllottedChange={(e) => {
                    this.handleHoursAllottedChange(e, i)
                }}
                // Hours Worked
                hoursWorked={this.state.projects[i].hoursWorked}
                onHoursWorkedChange={(e) => {
                    this.handleHoursWorkedChange(e, i)
                }}
                onDeleteProject={(e) => {
                    this.handleDeleteProject(e, i)
                }}
            />
        )
    }

    render() {
        let projects = this.state.projects.map((project, i) => {
            return this.renderProject(i);
        });

        return (
            <>
                <p>
                    March
                </p>
                <form>
                    <label htmlFor="workdays">
                        Workdays
                        <input
                            type="number"
                            id="workdays"
                            value={this.state.workdays}
                            onChange={(e, property) =>
                                this.handleChange(e, "workdays")
                            }
                        />
                    </label>
                    <label htmlFor="days-worked">
                        Days Worked
                        <input
                            type="number"
                            id="days-worked"
                            value={this.state.daysWorked}
                            onChange={(e, property) =>
                                this.handleChange(e, "daysWorked")
                            }
                        />
                    </label>
                </form>

                <p>{this.daysLeft} Workdays left</p>

                <hr />
                <p>Projects:</p>
                {projects}
                <button onClick={e => this.createProject()}>Create Project</button>
            </>
        );
    }
}

{
    /* ReactDOM.render(
    <Project />,
    document.getElementById("root")
) */
}

ReactDOM.render(<Month />, document.getElementById("root"));
