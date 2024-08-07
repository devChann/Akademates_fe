import axios from 'axios'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import React, { useCallback } from 'react'
import getFullUrl from '../../../configs/axios-custom'
import GrowlContext from '../../../configs/growlContext'
import { Button } from 'primereact/button'

export interface  ExperienceDto {
    title:string,
    desc:string,
    org:string,
    start: Date | Date[] | null
    end :Date | Date[] | null
    nature:string,
    location:string
}

const defaultSettings:ExperienceDto = {
    title:"",
    desc:"",
    org:"",
    start: new Date(),
    end:new Date(),
    nature:"",
    location:""
}

interface ExperienceProps{
    setshowEditwindow: React.Dispatch<React.SetStateAction<boolean>>
    editMode : boolean;
    data ?: ExperienceDto | undefined
}
const  ExperienceComponent:React.FunctionComponent<ExperienceProps> =({setshowEditwindow,data,editMode})=> {

    const growl = React.useContext(GrowlContext)
    const userToken = window.localStorage.getItem("refreshToken")
    const {id} = JSON.parse(userToken!)
    const[fieldValues,setProjectFields] = React.useState<ExperienceDto>(defaultSettings);

    const onvalueChange =<O extends keyof ExperienceDto> (prop:O, value:ExperienceDto[O])=>{
        setProjectFields({...fieldValues, [prop]:value})
    }
 
    React.useEffect(()=>{
        if (editMode && data) {
            console.log(data)
            setProjectFields(data as ExperienceDto)
        }else{
            setProjectFields(defaultSettings)
        }
    },[editMode])

    const canSave = fieldValues.title !== "" && fieldValues.org !== "" && fieldValues.desc && 
        fieldValues.start !== null &&  fieldValues.end !== null && fieldValues.location !== ""
    const saveExperience =()=>{
        if(!id){
            return
        }
        axios.post(getFullUrl(`/api/Auth/experince/${id}`),{
            Title:fieldValues.title,
            Org:fieldValues.org,
            RoleDesc:fieldValues.desc,
            Start:fieldValues.start,
            End:fieldValues.end,
            Nature:fieldValues.nature,
            Location:fieldValues.location,
            UserIdForeignKey:id
        }).then((res)=>{
            growl.current.show({
                severity:"success",
                summary:"Data saved successfully"
            })
            setshowEditwindow(false)
        }).catch((msg)=>{
            console.log(msg)
            growl.current.show({
                severity:"error",
                summary:"Error saving data"
            })
            setshowEditwindow(false)
        })
    }
    const EditExperience =useCallback(()=>{
        if(!id){
            return
        }
        axios.post(getFullUrl(`/api/auth/experince/${id}`),{
            Title:fieldValues.title,
            Org:fieldValues.org,
            RoleDesc:fieldValues.desc,
            Start:fieldValues.start,
            End:fieldValues.end,
            Nature:fieldValues.nature,
            Location:fieldValues.location,
            UserId:id
        }).then((res)=>{
            growl.current.show({
                severity:"success",
                summary:"Data saved successfully"
            })
        }).catch((msg)=>{
            growl.current.show({
                severity:"error",
                summary:"Error saving data"
            })
        })
    },[])
  return (
    <div className="grid">
        <div className="col">
            <div className='modal-content'>
                <div className="reset-password-container">
                    <div className="field">
                        <label className='input-lable-titles'  htmlFor="orgname" style={{ marginBottom: 8 }}>
                            Company<span className='required'>*</span>
                        </label>
                        <InputText id="name" name="name" value={fieldValues.org} onChange={((e)=> onvalueChange("org",e.currentTarget.value) )} className="modal-inputs"  />
                    </div>
                    <div className="field" style={{display:"grid"}}>
                        <label className='input-lable-titles'  htmlFor="orgname" style={{ marginBottom: 8 }}>
                            Start Date<span className='required'>*</span>
                        </label> 
                        <Calendar className='modal-inputs' id="date" name="date" value={
                           new Date(fieldValues.start as Date)} onChange= {((e)=>onvalueChange("start",e.target.value as Date))}  dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                    </div>                                                               
                </div>
                <div className="reset-password-container">
                    <div className="field" >
                        <label className='input-lable-titles'  htmlFor="orgname" style={{ marginBottom: 8 }}>
                        Mode<span className='required'>*</span>
                        </label>
                        <InputText placeholder='Fulltime | Part time | Remote' id="name" name="name" value={fieldValues.nature} 
                            onChange={((e)=>onvalueChange("nature",e.currentTarget.value))}
                        className="modal-inputs"  />
                    </div>
                    <div className="field" style={{display:"grid"}}>
                        <label className='input-lable-titles'  htmlFor="orgname" style={{ marginBottom: 8 }}>
                            End date<span className='required'>*</span>
                        </label> 
                            <Calendar className='modal-inputs' 
                            id="date" name="date" value={new Date(fieldValues.end as Date)}  onChange={((e)=>onvalueChange("end",e.target.value as Date))}
                            dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />   
                    </div>                                                                  
                </div>
                <div className="input-group-inline">
                    <label className='input-lable-titles'  htmlFor="orgname" style={{ marginBottom: 8 }}>
                        Title<span className='required'>*</span>
                    </label>
                    <InputTextarea value={fieldValues.title} rows={2} cols={83}  onChange={((e)=>onvalueChange("title",e.currentTarget.value))}
                    placeholder="role description"   className='input-textarea'  
                    />
                </div>
                <div className="input-group-inline">
                    <label className='input-lable-titles'  htmlFor="orgname" style={{ marginBottom: 8 }}>
                        Description<span className='required'>*</span>
                    </label>
                    <InputTextarea value={fieldValues.desc} rows={5} cols={83}  onChange={((e)=>onvalueChange("desc",e.currentTarget.value))}
                    placeholder="role description"   className='input-textarea'  
                    />
                </div>
               
                <div className="reset-password-container">
                <div className="field">
                    <label className='input-lable-titles'  htmlFor="orgname" style={{ marginBottom: 8 }}>
                        City<span className='required'>*</span>
                        </label>
                        <InputText id="name" name="name" value={fieldValues.location}
                        onChange={((e)=>onvalueChange("location",e.currentTarget.value))}
                        className="modal-inputs"  />
                    </div>
                    <div className="field button-group">
                        {!editMode ? <Button disabled={!canSave} onClick={saveExperience} className='reset-password-button'>Save</Button> :<Button onClick={EditExperience} className='reset-password-button'>Save edits</Button>}
                        
                    </div>                                                               
                </div>
            </div>
        </div>
    </div>
  )
}

export  default ExperienceComponent;