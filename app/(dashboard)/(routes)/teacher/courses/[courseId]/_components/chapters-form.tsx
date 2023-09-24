"use client"

import * as z from "zod"
import {useForm} from "react-hook-form";
import {Pencil, PlusCircle, XSquare} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {Chapter, Course} from "@prisma/client";
import {Input} from "@/components/ui/input";


interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
};

const formSchema = z.object({
    title:z.string().min(1),
});

export const ChaptersForm = ({
                              initialData,
                              courseId
                          }: ChaptersFormProps) => {

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });
    const {isSubmitting, isValid} = form.formState;
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter updated");
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }

    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                            <div className="text-red-600 flex items-center">
                                <XSquare className="h-4 w-4 mr-2"/>
                                Cancel
                            </div>
                        ) :
                        (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2"/>
                                Add a chapter
                            </>
                        )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Create
                            </Button>

                    </form>
                </Form>
            )}

            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapters"}

                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder th chapters
                </p>
            )}
        </div>
    )
}
