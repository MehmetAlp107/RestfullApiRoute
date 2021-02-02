const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/dosyalar"))

const Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://mali:Z5KEL3jYrRIeR09Y@cluster0.swiqm.mongodb.net/Cluster0?retryWrites=true&w=majority", {useNewUrlParser : true , useUnifiedTopology : true });  

const guzelSozSema = {
    kategori : String,
    icerik : String
}; 
  const GuzelSoz = mongoose.model("GuzelSoz", guzelSozSema );

//anasayfaya yönlendirelim,veri tabanından bulup bütün sozleri anasayfa getiriyoruz
 app.get("/", function(req,res){
     GuzelSoz.find({}, function(err, gelenSozler){
            res.render("anasayfa", {sozler: gelenSozler});    
            //console.log(gelenSozler)   ;
     });
 });
                 
//route yöntemi
// id sine göre güzel sözleri JSON formatında route edelim

app.route("/api/guzelsoz/:id")
.get(function(req,res){

        GuzelSoz.findOne({_id:req.params.id}, function(err, gelenVeri){
            res.send(gelenVeri);
        })
})
.put(function(req,res){
            //değişirmek isenen değerleri alıyorz
        var kategoriGelen = req.body.kategori;
        var icerikGelen = req.body.icerik;
                   //{updete edeceğimiz id},{değişirmek isenen değerleri}                   
        GuzelSoz.update({_id:req.params.id},{kategori:kategoriGelen, icerik:icerikGelen }, {overwrite:true}, function(err){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Kayıt Basarı ile güncellendi");
            }else{//error varsa erroru send et, göster
                res.send(err);
            }
        });
})
.patch(function(req,res){
                        
        GuzelSoz.update({_id:req.params.id},{$set: req.body /*{icerik : "hadibakalim", kategori : "tabiat"}*/ }, function(err){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Kayıt Basarı ile güncellendi");
            }else{//error varsa erroru send et, göster
                res.send(err);
            }
        });
})
.delete(function(req,res){

        GuzelSoz.deleteOne({_id:req.params.id}, function(err){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Basarı ile silindi");
            }else{//error varsa erroru send et, göster
               res.send(err);
            }
        })
});

// id siz güzel sözleri JSON formatında route edelim
app.route("/api/guzelsozler")
.get(function(req,res){
 
                    //{}all değerleri getirmek için
        GuzelSoz.find({}, function(err, gelenVeriler){
             
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send(gelenVeriler);
            }else{//error varsa erroru send et, göster
                res.send(err);
            }
        })
})
.post( function(req,res){
    // yazılan verileri almak için
    var kategori = req.body.kategori;
    var icerik = req.body.icerik;

    //yazılan verilerden model olusturmak için
    var  guzelSoz = new GuzelSoz({
                kategori:kategori,
                icerik :icerik
            });
         // veri tabanına kayıt ediyorz   
        guzelSoz.save(function(){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Basarı ile kaydedildi")
            }else{//error varsa erroru send et, göster
                res.send(err);
            }
        });
})
.delete(function(req,res){

        GuzelSoz.deleteMany({}, function(err){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Tüm kayıtlar Basarı ile silindi");
            }else{//error varsa erroru send et, göster
               res.send(err);
            }
        })
});


app.listen(5000, function(){
    console.log("5000 portuna bağlandık!")
});