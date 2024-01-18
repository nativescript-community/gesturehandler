//
//  NativeViewHandler.m
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "NativeViewHandler.h"

#import <UIKit/UIGestureRecognizerSubclass.h>


#pragma mark DummyGestureRecognizer

@implementation DummyGestureRecognizer

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    self.state = UIGestureRecognizerStateFailed;
    [self reset];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    self.state = UIGestureRecognizerStateCancelled;
    [self reset];
}

@end

#pragma mark NativeViewgestureHandler

@implementation NativeViewGestureHandler {
    BOOL _shouldActivateOnStart;
    BOOL _disallowInterruption;
}

- (instancetype)initWithTag:(NSNumber *)tag
{
    if ((self = [super initWithTag:tag])) {
        _recognizer = [[DummyGestureRecognizer alloc] init];
        self.shouldCancelWhenOutside = YES;
    }
    return self;
}

- (void)configure:(NSDictionary *)config
{
    [super configure:config];
    _shouldActivateOnStart = [config[@"shouldActivateOnStart"] boolValue];
    _disallowInterruption = [config[@"disallowInterruption"] boolValue];
}

//
- (void) setShouldActivateOnStart:(Boolean) value {
  _shouldActivateOnStart = value;
}
//
//- (NSNumber *) shouldActivateOnStart {
//  return [NSNumber numberWithBool: _shouldActivateOnStart];
//}
- (void) setDisallowInterruption:(Boolean) value {
  _disallowInterruption = value;
}
//
//- (NSNumber *) disallowInterruption {
//  return [NSNumber numberWithBool: _disallowInterruption];
//}


- (void)bindToView:(UIView *)view
{
    // For UIControl based views (UIButton, UISwitch) we provide special handling that would allow
    // for properties like `disallowInterruption` to work.
    if ([view isKindOfClass:[UIControl class]]) {
        UIControl *control = (UIControl *)view;
        [control addTarget:self action:@selector(handleTouchDown:forEvent:) forControlEvents:UIControlEventTouchDown];
        [control addTarget:self action:@selector(handleTouchUpOutside:forEvent:) forControlEvents:UIControlEventTouchUpOutside];
        [control addTarget:self action:@selector(handleTouchUpInside:forEvent:) forControlEvents:UIControlEventTouchUpInside];
        [control addTarget:self action:@selector(handleDragExit:forEvent:) forControlEvents:UIControlEventTouchDragExit];
        [control addTarget:self action:@selector(handleDragEnter:forEvent:) forControlEvents:UIControlEventTouchDragEnter];
        [control addTarget:self action:@selector(handleTouchCancel:forEvent:) forControlEvents:UIControlEventTouchCancel];
    } else {
        [super bindToView:view];
    }

    // We can restore default scrollview behaviour to delay touches to scrollview's children
    // because gesture handler system can handle cancellation of scroll recognizer when JS responder
    // is set
    if ([view isKindOfClass:[UIScrollView class]]) {
        // This part of the code is coupled with RN implementation of ScrollView native wrapper and
        // we expect for RCTScrollView component to contain a subclass of UIScrollview as the only
        // subview
        UIScrollView *scrollView = (UIScrollView*)view;
        scrollView.delaysContentTouches = YES;
    }
}

- (void)handleTouchDown:(UIView *)sender forEvent:(UIEvent *)event
{
    [self reset];

    if (_disallowInterruption) {
        // When `disallowInterruption` is set we cancel all gesture handlers when this UIControl
        // gets DOWN event
        for (UITouch *touch in [event allTouches]) {
            for (UIGestureRecognizer *recogn in [touch gestureRecognizers]) {
                recogn.enabled = NO;
                recogn.enabled = YES;
            }
        }
    }
    [self sendEventsInState:GestureHandlerStateActive
             forView:sender
              withExtraData:@{@"pointerInside": @(YES)}];
}

- (void)handleTouchUpOutside:(UIView *)sender forEvent:(UIEvent *)event
{
    [self sendEventsInState:GestureHandlerStateEnd
             forView:sender
              withExtraData:@{@"pointerInside": @(NO)}];
}

- (void)handleTouchUpInside:(UIView *)sender forEvent:(UIEvent *)event
{
    [self sendEventsInState:GestureHandlerStateEnd
             forView:sender
              withExtraData:@{@"pointerInside": @(YES)}];
}

- (void)handleDragExit:(UIView *)sender forEvent:(UIEvent *)event
{
    // Pointer is moved outside of the view bounds, we cancel button when `shouldCancelWhenOutside` is set
    if (self.shouldCancelWhenOutside) {
        UIControl *control = (UIControl *)sender;
        [control cancelTrackingWithEvent:event];
        [self sendEventsInState:GestureHandlerStateEnd
                 forView:sender
                  withExtraData:@{@"pointerInside": @(NO)}];
    } else {
        [self sendEventsInState:GestureHandlerStateActive
                 forView:sender
                  withExtraData:@{@"pointerInside": @(NO)}];
    }
}

- (void)handleDragEnter:(UIView *)sender forEvent:(UIEvent *)event
{
    [self sendEventsInState:GestureHandlerStateActive
             forView:sender
              withExtraData:@{@"pointerInside": @(YES)}];
}

- (void)handleTouchCancel:(UIView *)sender forEvent:(UIEvent *)event
{
    [self sendEventsInState:GestureHandlerStateCancelled
             forView:sender
              withExtraData:@{@"pointerInside": @(NO)}];
}

@end
