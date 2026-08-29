import ProgramForm from "../components/ProgramForm";
import "../styles/program.css";

export default function CreateProgramPage() {
    return (
        <div className="program-layout">

            <div className="program-main">

                <div className="program-content">

                    <ProgramForm />

                </div>

            </div>

        </div>
    );
}