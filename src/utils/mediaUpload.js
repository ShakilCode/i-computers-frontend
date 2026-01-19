import { createClient } from "@supabase/supabase-js"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxandudW5ha2R4cW5lcndwYXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzMzMDEsImV4cCI6MjA4NDIwOTMwMX0.K2H249xoRxRY0tzn_gaBEkH9Su1-CH98wn17-JJqzRg"
const supabaseUrl = "https://hqjwnunakdxqnerwpaxx.supabase.co"

const supabase = createClient (supabaseUrl, supabaseKey)

export default function uploadFile(file){

    return new Promise(

        (resolve, reject)=>{

            if(file == null){
                reject("No file provided")
                return
            }

            const timestamp = new Date().getTime()
            const fileName = timestamp + "-" + file.name

            supabase.storage.from("Images").upload(fileName, file, {
                upsert : false,
                cacheControl : 3600
            }).then(
                ()=>{
                    const url = supabase.storage.from("Images").getPublicUrl(fileName).data.publicUrl
                    resolve(url)
                }
            ).catch(
                ()=>{
                    reject("Failed to upload file")
                }
            )

        }
    )
}