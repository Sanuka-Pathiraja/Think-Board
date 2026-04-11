import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Navbar = () => {
    return (
        <div className="navbar bg-base-200 border-b border-base-content/10">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-2">
                <Link to="/" className="text-4xl font-bold text-primary font-mono tracking-tight">
                    ThinkBoard
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/create" className="btn btn-primary">
                        <Plus className="h-4 w-5" />
                        <span>New Note</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
