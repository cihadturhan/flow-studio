/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .constant('CANVAS',
            {
                canvas: {
                    hasGrid: true,
                    hasZoom: true,
                    isReadonly: false,
                    hasCoronaDecoration: true
                },
                basic: {
                    label: {
                        step_label: {
                            attr: {
                                x: 40,
                                y: 10,
                                padding: 0,
                                cssClass: "canvas_label autoflow_canvas_step_label"
                            },
                            config: {
                                name: "autoflow.canvas.basic.label.step_label"
                            }
                        },
                        event_label: {
                            attr: {
                                radius: 5,
                                stroke: 0,
                                fontSize: 14,
                                bgColor: "ffaa39",
                                fontColor: "ffffff",
                                cssClass: "canvas_label autoflow_canvas_basic_event_label"
                            },
                            config: {
                                name: "autoflow.canvas.basic.label.event_label",
                                service: "EventLabel"
                            }

                        },
                        time_label: {
                            attr: {
                                radius: 5,
                                stroke: 0,
                                fontSize: 14,
                                bgColor: "f08080",
                                fontColor: "ffffff",
                                cssClass: "canvas_label autoflow_canvas_basic_time_label"
                            },
                            config: {
                                name: "autoflow.canvas.basic.label.time_label",
                                service: "TimeLabel"
                            }
                        },
                        rule_label: {
                            attr: {
                                radius: 5,
                                stroke: 0,
                                fontSize: 14,
                                bgColor: "4ca6d6",
                                fontColor: "ffffff",
                                cssClass: "canvas_label autoflow_canvas_basic_rule_label"
                            },
                            config: {
                                name: "autoflow.canvas.basic.label.rule_label",
                                service: "RuleLabel"
                            }
                        }
                    },
                    connection: {
                        event_connection: {
                            attr: {
                                cssClass: "autoflow_canvas_basic_event_connection",
                                color: "#328b3f"
                            },
                            config: {
                                name: "autoflow.canvas.basic.connection.event_connection",
                                service: "EventConnection"
                            }
                        },
                        rule_connection: {
                            attr: {
                                cssClass: "autoflow_canvas_basic_rule_connection",
                                color: "#328b3f"
                            },
                            config: {
                                name: "autoflow.canvas.basic.connection.rule_connection",
                                service: "RuleConnection"
                            }
                        }
                    },
                    anchor: {
                        fan_connection_anchor: {
                            attr: {},
                            config: {
                                name: "autoflow.canvas.basic.anchor.fan_connection_anchor"
                            }
                        }
                    },
                    locator: {
                        rule_locator: {
                            config: {
                                name: "autoflow.canvas.basic.locator.rule_locator"
                            }
                        },
                        time_locator: {
                            config: {
                                name: "autoflow.canvas.basic.locator.time_locator"
                            }
                        },
                        time_label_locator: {
                            config: {
                                name: "autoflow.canvas.basic.locator.time_label_locator"
                            }
                        },
                        event_locator: {
                            config: {
                                name: "autoflow.canvas.basic.locator.event_locator"
                            }
                        }
                    },
                    layout: {
                        time_horizontal_layout: {
                            attr: {
                                radius: 5,
                                stroke: 2,
                                fontSize: 14,
                                bgColor: "f08080",
                                fontColor: "ffffff",
                                cssClass: "canvas_label autoflow_canvas_basic_time_horizontal_layout"
                            },
                            config: {
                                name: "autoflow.canvas.basic.layout.time_horizontal_layout"
                            }
                        }
                    },
                    policy: {
                        drop_interceptor_policy: {
                            config: {
                                name: "autoflow.canvas.basic.policy.drop_interceptor_policy"
                            }
                        }
                    }
                },
                icon: {
                    action: {
                        attr: {
                            width: 20,
                            height: 20,
                            radius: 45,
                            cssClass: "autoflow_canvas_icon_action"
                        },
                        config: {
                            image: "../../../content/images/lightning.png",
                            name: "autoflow.canvas.icon.action",
                            service: "ActionIcon"
                        }
                    },
                    rule: {
                        attr: {
                            width: 40,
                            height: 40,
                            radius: 0,
                            cssClass: "autoflow_canvas_icon_rule"
                        },
                        config: {
                            image: "../../../content/images/rule_icon.png",
                            name: "autoflow.canvas.icon.rule",
                            service: "RuleIcon"
                        }
                    },
                    event: {
                        attr: {
                            width: 120,
                            height: 60,
                            radius: 0,
                            cssClass: "autoflow_canvas_icon_event"
                        },
                        config: {
                            image: "../../../content/images/lightning.png",
                            name: "autoflow.canvas.icon.event",
                            service: "EventIcon"
                        }
                    },
                    rule_mini: {
                        attr: {
                            width: 20,
                            height: 20,
                            radius: 0,
                            cssClass: "autoflow_canvas_icon_rule_mini"
                        },
                        config: {
                            image: "../../../content/images/rule_icon.png",
                            name: "autoflow.canvas.icon.rule_mini",
                            service: "RuleminiIcon"
                        }
                    },
                    time_mini: {
                        attr: {
                            width: 30,
                            height: 30,
                            radius: 0,
                            visible: false,
                            cssClass: "autoflow_canvas_icon_time_mini"
                        },
                        config: {
                            image: "../../../content/images/time_icon.png",
                            name: "autoflow.canvas.icon.time_mini",
                            service: "TimeMiniIcon"
                        }
                    },
                    start_step: {
                        attr: {
                            width: 30,
                            height: 30,
                            radius: 50,
                            cssClass: "autoflow_canvas_icon_start_step"
                        },
                        config: {
                            name: "autoflow.canvas.icon.start_step",
                            service: "StartStepIcon"
                        }

                    },
                    step: {
                        attr: {
                            width: 120,
                            height: 60,
                            radius: 20,
                            cssClass: "autoflow_canvas_icon_step"
                        },
                        config: {
                            name: "autoflow.canvas.icon.step",
                            service: "StepIcon"
                        }

                    },
                    step_loop: {
                        attr: {
                            width: 20,
                            height: 20,
                            radius: 20,
                            cssClass: "autoflow_canvas_icon_step_loop"
                        },
                        config: {
                            image: "../../../content/images/loop.png",
                            name: "autoflow.canvas.icon.step_loop",
                            service: "StepLoopIcon"
                        }

                    }
                },
                buttons: {
                    save: 'save',
                    draft: 'draft'
                }
            }
        )
})(angular);