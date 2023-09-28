import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import {getDashboardCourses} from "@/actions/get-dashboard-courses";
import {InfoCard} from "@/app/(dashboard)/(routes)/(root)/_components/info-card";
import {CheckCircle, Clock} from "lucide-react";
import {CoursesList} from "@/components/courses-list";


export default async function Dashboard() {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        completedCourses,
        coursesInProgress,
    } = await getDashboardCourses(userId);

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                    numberOfItems={coursesInProgress.length}
                    label="In Progress"
                    icon={Clock}
                />
                <InfoCard
                    numberOfItems={completedCourses.length}
                    label="Completed"
                    icon={CheckCircle}
                    variant="success"
                />
            </div>
            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        </div>
    )
}
