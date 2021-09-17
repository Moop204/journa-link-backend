import path from "path";
import fs from "fs";

const directoryPath = path.join(
  __dirname,
  "../../../../../news-please-repo/data/2021/09/07/nytimes.com"
);

const aggregateFiles = () => {
  const res: JSON[] = [];
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    if (file.match(/.*\.json/)) {
      const str = fs.readFileSync(directoryPath + "/" + file, "utf8");
      const instance = JSON.parse(str);
      delete instance["image_url"];
      delete instance["description"];
      delete instance["date_download"];
      delete instance["date_modify"];
      delete instance["date_publish"];
      delete instance["filename"];
      delete instance["maintext"];
      delete instance["language"];
      delete instance["localpath"];
      delete instance["title_page"];
      delete instance["title_rss"];
      delete instance["description"];

      if (instance.authors.length > 0) {
        instance.authors = instance.authors.map((name: string) => {
          // Manual changes depending on what you notice
          name = name.replace(" Special To The New York Times", "");
          name = name.replace(/\./g, "");
          name = name.trim();
          // console.log(name);
          return name;
        });
        res.push(instance);
      }
    }
  });
  return res;
};

interface ArticleDescriptor extends JSON {
  authors: string[];
  title: string;
  source_domain: string;
  url: string;
}

const authorProfile = (articles: ArticleDescriptor[]) => {
  const authorDict: any = {};
  articles.forEach((article) => {
    const articleDesc = {
      title: article.title,
      link: article.url,
    };
    article.authors.forEach((author) => {
      if (authorDict[author]) {
        if (authorDict[author][article.source_domain]) {
          // console.log("Should reach");
          authorDict[author][article.source_domain].push(articleDesc);
        } else {
          // console.log("No reach");
          authorDict[author][article.source_domain] = [articleDesc];
        }
      } else {
        // console.log("Definitely");
        authorDict[author] = {};
        authorDict[author][article.source_domain] = [articleDesc];
      }
    });
  });
  return authorDict;
};

const obtainDataStructure = () => {
  const here = aggregateFiles();
  // console.log(here);
  return authorProfile(here as ArticleDescriptor[]);
  // const res = fs.writeFileSync(
  //   __dirname + "/out.json",
  //   '{"res":' + JSON.stringify(here) + "}",
  //   {}
  // );
};

export { obtainDataStructure };
