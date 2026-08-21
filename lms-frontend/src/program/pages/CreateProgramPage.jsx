

import ProgramForm from "../components/ProgramForm";

import "../styles/program.css";

export default function CreateProgramPage() {

    return (

        <div className="program-layout">

          

            <div className="program-main">

             

                <div className="program-content">

                    <div className="page-header">
                        <h3 style={{ fontSize: "24px" }}>Create Program</h3>
                    </div>

                    <ProgramForm />

                </div>

            </div>

        </div>
    );
}