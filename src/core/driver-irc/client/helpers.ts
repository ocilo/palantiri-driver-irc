import {MessageType, MessageInfo, getMessageInfo} from "./message-info";

export interface Message{
  raw: string,
  name: string,
  type: MessageType,
  args: string[],
  prefix: string
  nick: string,
  user: string,
  host: string
  server: string,
  stringValue: string
}

let defaultCommand: Message = {
  raw: "",
  name: null,
  type: null,
  args: [],
  prefix: null,
  nick: null,
  user: null,
  host: null,
  server: null,
  stringValue: ""
};

export function parseMessage(line: string): Message{
  let command:Message = _.clone(defaultCommand);
  command.raw = line;

  let match: string[];

  // Parse prefix
  match = line.match(/^:([^ ]+) +/);
  if (match) {
    command.prefix = match[1];
    line = line.substring(match[0].length);
    match = command.prefix.match(/^([_a-zA-Z0-9\~\[\]\\`^{}|-]*)(?:!([^@]+)@(.*))?$/);
    if (match) {
      command.nick = match[1];
      command.user = match[2];
      command.host = match[3];
    } else {
      command.server = command.prefix;
    }
  }

  // Parse command
  match = line.match(/^([^ ]+) */);

  let commandPart: string = match[1];
  let commandDescriptor: MessageInfo = getMessageInfo(commandPart);

  command.name = commandDescriptor.name;
  command.type = commandDescriptor.type;

  line = line.substring(match[0].length);

  let middle: string, trailing: string;

  // Parse parameters
  if (line.search(/^:|\s+:/) != -1) {
    match = line.match(/(.*?)(?:^:|\s+:)(.*)/);
    middle = match[1].trim();
    trailing = match[2];
  }
  else {
    middle = line;
    trailing = "";
  }

  if (middle.length){
    command.args = middle.split(/ +/);
  } else {
    command.args = [];
  }


  if (trailing.length){
    command.args.push(trailing)
  }

  return command;
}