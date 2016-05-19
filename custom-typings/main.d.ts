/// <reference path="../typings/index.d.ts" />

declare module 'gulp-bump' {
  namespace bump {
    interface Options {
      type?: string;
      version?: string;
      key?: string
    }
  }

  function bump(options?: bump.Options): NodeJS.ReadWriteStream;

  export = bump;
}

declare module 'gulp-git' {
  namespace git {
    interface BaseOpts {
      args?: string,
      quiet?: boolean
    }

    interface Callback {
      (err: Error): void
    }

    interface InitOpts extends BaseOpts {
      cwd?: string
    }

    function init(opts?: InitOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface CloneOpts extends BaseOpts {
      cwd?: string
    }

    function clone(remote: string, opts?: CloneOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface AddOpts extends BaseOpts {}

    function add(opts?: AddOpts): NodeJS.ReadWriteStream;

    interface CommitOpts extends BaseOpts {
      cwd?: string,
      maxBuffer?: number,
      disableMessageRequirement?: boolean,
      disableAppendPaths?: boolean,
      emitData?: boolean
    }

    function commit(message: string | Array<string>, opts?: CommitOpts): NodeJS.ReadWriteStream;

    interface AddRemoteOpts extends BaseOpts {
      cwd?: string
    }

    function addRemote(remote: string, url: string, opts?: AddRemoteOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface RemoveRemoteOpts extends BaseOpts {
      cwd?: string
    }

    function removeRemote(remote: string, opts?: RemoveRemoteOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface FetchOpts extends BaseOpts {
      cwd?: string
    }

    function fetch(remote: string, branch: string, opts?: FetchOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface PullOpts extends BaseOpts {
      cwd?: string
    }

    function pull(remote: string, branch: string, opts?: PullOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface PushOpts extends BaseOpts {
      cwd?: string
    }

    function push(remote: string, branch: string, opts?: PushOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface TagOpts extends BaseOpts {
      cwd?: string
    }

    function tag(version: string, message: string, opts?: TagOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface BranchOpts extends BaseOpts {
      cwd?: string
    }

    function branch(branch: string, opts?: BranchOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface CheckoutOpts extends BaseOpts {
      cwd?: string
    }

    function checkout(branch: string, opts?: CheckoutOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface CheckoutFilesOpts extends BaseOpts { }

    function checkoutFiles(opts?: CheckoutFilesOpts): NodeJS.ReadWriteStream;

    interface MergeOpts extends BaseOpts {
      cwd?: string
    }

    function merge(branch: string, opts?: MergeOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface RmOpts extends BaseOpts { }

    function rm(opts?: RmOpts): NodeJS.ReadWriteStream;

    interface ResetOpts extends BaseOpts {
      cwd?: string
    }

    function reset(commit: string, opts?: ResetOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface RevParseOpts extends BaseOpts {
      cwd?: string
    }

    function revParse(opts?: RevParseOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface AddSubmoduleOpts extends BaseOpts { }

    function addSubmodule(remote: string, path: string, opts?: AddSubmoduleOpts): NodeJS.ReadWriteStream;

    interface UpdateSubmoduleOpts extends BaseOpts { }

    function updateSubmodule(opts?: UpdateSubmoduleOpts): NodeJS.ReadWriteStream;

    interface StatusOpts extends BaseOpts {
      cwd?: string,
      maxBuffer?: number
    }

    function status(opts?: StatusOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface ExecOpts extends BaseOpts {
      cwd?: string,
      maxBuffer?: number
    }

    function exec(opts?: ExecOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;

    interface CleanOpts extends BaseOpts {
      cwd?: string
    }

    function clean(paths?: string, opts?: CleanOpts | Callback, cb?: Callback): NodeJS.ReadWriteStream;
  }

  export default git;
}

declare module 'gulp-tag-version' {
  namespace tag {
    interface Opts {
      key?: string,
      prefix?: string,
      push?: boolean,
      label?: string
    }
  }

  function tag(opts?: tag.Opts): NodeJS.ReadWriteStream;

  export default tag;
}

declare module 'gulp-conventional-changelog' {
  namespace changelog {
    type Presets = 'angular' | 'atom' | 'codemirror' | 'ember' | 'eslint' | 'express' | 'jquery' | 'jscs' | 'jshint';

    interface Opts {
      preset: Presets,
      config?: Function | Object | PromiseLike<Object>,
      pkg?: {
        path?: string,
        transform?: Function
      },
      append?: boolean,
      releaseCount?: number,
      debug?: Function,
      warn?: Function,
      transform?: Function,
      outputUnreleased?: boolean
    }

    interface Context {
      host?: string,
      version?: string,
      owner?: string,
      repository?: string,
      repoUrl?: string,
      previousTag?: string,
      currentTag?: string,
      linkCompare?: boolean
    }

    interface GitRawCommitsOpts {
      format?: string,
      from?: string,
      reverse?: boolean,
      debug?: Function
    }

    interface ParserOpts {
      warn?: Function
    }

    interface WriterOpts {
      debug?: Function,
      reverse?: boolean,
      doFlush?: boolean
    }
  }

  function conventionalChangelog(
    options?: changelog.Opts,
    context?: changelog.Context,
    gitRawCommitsOpts?: changelog.GitRawCommitsOpts,
    parserOpts?: changelog.ParserOpts,
    writerOpts?: changelog.WriterOpts): NodeJS.ReadWriteStream;

  export default conventionalChangelog;
}
