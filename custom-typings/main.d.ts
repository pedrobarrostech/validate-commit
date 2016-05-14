declare module 'gulp-bump' {
  namespace bump {
    interface Options {
      type?: string;
      version?: string;
      key?: string
    }

    // A transform stream with a .restore object
    interface Filter extends NodeJS.ReadWriteStream {
      restore: NodeJS.ReadWriteStream
    }
  }

  function bump(options?: bump.Options): bump.Filter;

  export default bump;
}

declare module 'gulp-git' {
  namespace git {

    // A transform stream with a .restore object
    interface Filter extends NodeJS.ReadWriteStream {
      restore: NodeJS.ReadWriteStream
    }
  }

  function git(): git.Filter;

  export default git;
}

declare module 'gulp-tag-version' {
  namespace tag {

    // A transform stream with a .restore object
    interface Filter extends NodeJS.ReadWriteStream {
      restore: NodeJS.ReadWriteStream
    }
  }

  function tag(): tag.Filter;

  export default tag;
}

declare module 'gulp-conventional-changelog' {
  namespace conventionalChangelog {

    // A transform stream with a .restore object
    interface Filter extends NodeJS.ReadWriteStream {
      restore: NodeJS.ReadWriteStream
    }
  }

  function conventionalChangelog(): conventionalChangelog.Filter;

  export default conventionalChangelog;
}
