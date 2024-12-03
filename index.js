import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

const apiUrl = "https://api.mangadex.org/"

app.get("/",async (req, res) => {
    try {
        const response = await axios.get(apiUrl+"manga");
        const feed = (response.data.data);
        const mangaId = [];
        const coverId = [];
        const coverName = [];
        const coverUrl = [];
        const mangaName = [];
        for(let i=0;i<feed.length;i++) {
            mangaId[i] = feed[i].id;
            mangaName[i] = feed[i].attributes.title.en;
            const rel = feed[i].relationships;
            for(let j=0;j<rel.length;j++) {
                if(rel[j].type == "cover_art") {
                    coverId[i] = rel[j].id;
                    break;
                }
            }
            const apiCover = apiUrl+"cover/"+coverId[i];
            try {
                const coverRes = await axios.get(apiCover);
                coverName[i] = (coverRes.data.data.attributes.fileName);
                coverUrl[i] = "https://uploads.mangadex.org/covers/"+mangaId[i]+"/"+coverName[i]+".256.jpg";
            }    
            catch (e) {
                console.log(e.response.data)
            } 
        }
        console.log(mangaName);
        res.render("index.ejs", { cover: coverUrl, title: mangaName});
    }
    catch (e) {
        console.log(e);
    }
})

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
})