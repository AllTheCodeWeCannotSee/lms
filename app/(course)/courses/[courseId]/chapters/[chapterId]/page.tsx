import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";


const ChapterIdPage = async ({
    params
                             }: {params: { courseId: string; chapterId: string }}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    return (
        <div>
            pages
        </div>
    )
}

export default ChapterIdPage;
