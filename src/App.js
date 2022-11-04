import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, Children } from "react";
import { createWorker } from "tesseract.js";
import { saveAs } from "file-saver";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";
function App() {
  const [ocr, setOcr] = useState("");
  const [imageData, setImageData] = useState(null);
  const worker = createWorker({
    logger: (m) => {
      console.log(m);
    },
  });
  const [text, setTet] = useState("Choose file");
  const convertImageToText = async () => {
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageData);

    setOcr(text);
    const doc = createDocument();

    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  };
  useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }
  // const SampleDocument = () => (
  //   <Document>
  //     <Text>Hello World</Text>
  //   </Document>
  // )
  const createDocument = () => {
    const doc = new Document({
      creator: "Clippy",
      title: "Sample Document",
      description: "A brief example of using docx",

      styles: {
        default: {
          listParagraph: {
            run: {
              color: "#000000",
            },
            
          },
        },
        paragraphStyles: [
          {
            id: "aside",
            name: "Aside",
            basedOn: "Normal",
            next: "Normal",
            run: {
              color: "#000000",
              italics: true,
            },
            paragraph: {
              spacing: {
                line: 276,
              },
            },
          },
          {
            id: "wellSpaced",
            name: "Well Spaced",
            basedOn: "Normal",
            quickFormat: true,
            paragraph: {
              spacing: {
                line: 276,
                before: 20 * 72 * 0.1,
                after: 20 * 72 * 0.05,
              },
            },
          },
          {
            id: "strikeUnderline",
            name: "Strike Underline",
            basedOn: "Normal",
            quickFormat: true,
            run: {
              strike: true,
            },
          },
        ],
      },

      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: ocr,
                  color: "#000000",
                  font: {
                    name: "Times New Roman",
                  },
                  size: 24,
                
                }),
              ],
            }),
          ],
        },
      ],
    });
    return doc;
  };
  return (
    <div className="App">
      <div>
        <p>Choose an Image</p>
        <input
          type="file"
          name=""
          id=""
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      <div className="display-flex">
        <img src={imageData} alt="" srcset="" />
        <p>{ocr}</p>
      </div>
    </div>
  );
}

export default App;
