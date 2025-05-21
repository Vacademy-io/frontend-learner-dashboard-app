import { MyButton } from "@/components/design-system/button";
import { MyInput } from "@/components/design-system/input";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import { ArrowUp, X } from "@phosphor-icons/react"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { doubtListDummy } from "../dummy-data/doubt-list";
import { Doubt } from "./doubt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export const DoubtResolutionSidebar = ({setDoubtProgressMarkerPdf, setDoubtProgressMarkerVideo}:{setDoubtProgressMarkerPdf:Dispatch<SetStateAction<number | null>>, setDoubtProgressMarkerVideo:Dispatch<SetStateAction<number | null>>}) => {
    const {open, setOpen} = useSidebar();
    const [showInput, setShowInput] = useState<boolean>(false)
    const [doubt, setDoubt] = useState<string>("")

    const handleDoubtChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDoubt(event.target.value)
    }
   return(
    // <SidebarProvider >
      <Sidebar side="right" className={`${open? "w-[50vw]" : "w-0"} bg-white p-4 flex flex-col gap-6`} >
        <SidebarHeader className="flex items-center justify-between w-full bg-white">
            <div className="flex items-center justify-between bg-white w-full">
                <h1 className="text-2xl font-semibold text-primary-500">Doubt Resolution</h1>
                <X className="hover:cursor-pointer" onClick={()=>setOpen(false)} />
            </div>
        </SidebarHeader>
        <SidebarContent className="flex flex-col gap-4 overflow-y-scroll no-scrollbar bg-white pt-6">
            <Tabs defaultValue="All ">
                <TabsList className="w-full flex border-b border-neutral-300 p-0 bg-white rounded-none">
                    <TabsTrigger value="All" className="w-full data-[state=active]:shadow-none rounded-none rounded-tl-md rounded-tr-md border-white border-l-[1px] border-r-[1px] border-t-[1px] data-[state=active]:border-primary-200 data-[state=active]:text-primary-500 pt-2">All</TabsTrigger>
                    <TabsTrigger value="Resolved" className="w-full data-[state=active]:shadow-none rounded-none rounded-tl-md rounded-tr-md border-white border-l-[1px] border-r-[1px] border-t-[1px] data-[state=active]:border-primary-200 data-[state=active]:text-primary-500 pt-2">Resolved</TabsTrigger>
                    <TabsTrigger value="Unresolved" className="w-full data-[state=active]:shadow-none rounded-none rounded-tl-md rounded-tr-md border-white border-l-[1px] border-r-[1px] border-t-[1px] data-[state=active]:border-primary-200 data-[state=active]:text-primary-500 pt-2">Unresolved</TabsTrigger>
                </TabsList>
                <TabsContent value="All">
                    {doubtListDummy.map((doubt, key) => (
                        <Doubt doubt={doubt} key={key} setDoubtProgressMarkerPdf={setDoubtProgressMarkerPdf} setDoubtProgressMarkerVideo={setDoubtProgressMarkerVideo} />
                    ))}
            </TabsContent>
            </Tabs>
        </SidebarContent>
        <SidebarFooter className="w-full flex items-center justify-center bg-white">
            <MyButton scale="large" onClick={()=>setShowInput(true)}>Ask Doubt</MyButton>
            {showInput && (
                <div className="bg-neutral-100 rounded-md p-3 w-full flex gap-2">
                    <MyInput inputType="text" inputPlaceholder="Ask your doubt here" input={doubt} onChangeFunction={handleDoubtChange} className="bg-white" />
                    <MyButton layoutVariant="icon">
                        <ArrowUp />
                    </MyButton>
                </div>
            )}
        </SidebarFooter>
      </Sidebar>
    // </SidebarProvider>
   )
}